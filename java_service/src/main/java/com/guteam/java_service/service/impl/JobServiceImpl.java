package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.guteam.java_service.config.Redis.RedisUtil2;
import com.guteam.java_service.config.Redis.RedisUtil3;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.entity.mongo.JobOutput;
import com.guteam.java_service.entity.mongo.JobRunInfo;
import com.guteam.java_service.respository.mongodb.JobOutputRepository;
import com.guteam.java_service.respository.mongodb.JobRunInfoRepository;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.DisplayService;
import com.guteam.java_service.service.JobService;
import com.guteam.java_service.util.ThreadHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class JobServiceImpl implements JobService {
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private AlgorithmRepository algorithmRepository;
    @Autowired
    private InputRepository inputRepository;
    @Autowired
    private InputTypeRepository inputTypeRepository;
    @Autowired
    private DisplayService displayService;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private NavigationParentRepository navigationParentRepository;
    @Autowired
    private JobOutputRepository jobOutputRepository;
    @Autowired
    private JobRunInfoRepository jobRunInfoRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private RedisUtil3 redisUtil3;
    @Autowired
    private RedisUtil2 redisUtil2;
    @Autowired
    private ThreadHelper threadHelper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AlgorithmEngineRepository algorithmEngineRepository;
    @Autowired
    private AlgorithmEnvironmentRepository algorithmEnvironmentRepository;

    @Value("${isspersPath}")
    private String isspersPath;
    @Value("${algorithmPath}")
    private String algorithmPath;
    @Value("${dataPath}")
    private String dataPath;


    public class ThreadRunAlgorithm extends Thread {
        private String jobId;

        public void setJobId(String jobId) {
            this.jobId = jobId;
        }

        @Override
        public void run() {
            super.run();
            Job job = (Job) redisUtil2.hget(jobId, "job");
            List<JSONObject> algorithmList = (List<JSONObject>) redisUtil2.hget(jobId, "algorithmList");
            String userId = (String) redisUtil2.hget(jobId, "userId");
            Project project = (Project) redisUtil2.hget(jobId, "project");
            String projectId = project.getId();


            redisUtil2.hset(jobId, "save", 0);

            int algorithmListSize = algorithmList.size();
            String jobId = job.getId();
            JSONObject param = new JSONObject();
            param.put("algorithmList", JSONArray.toJSONString(algorithmList, SerializerFeature.DisableCircularReferenceDetect));
            param.put("algorithmPath", isspersPath + algorithmPath);
            param.put("dataPath", isspersPath + dataPath + project.getProjectPath());
            param.put("jobId", jobId);

            String url = "http://sidecar/run";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/json; charset=UTF-8"));
            headers.add("Accept", MediaType.APPLICATION_JSON.toString());

            HttpEntity<String> httpEntity = new HttpEntity<>(JSONObject.toJSONString(param), headers);
            ResponseEntity<String> result = restTemplate.postForEntity(url, httpEntity, String.class);

            JSONObject back = JSON.parseObject(result.getBody());

            JSONObject jsonObject1 = (JSONObject) back.get("state");
            List<JSONObject> objectList;

            if (jsonObject1.get("sign").equals("success")) {
                objectList = OutputProcess((JSONObject) back.get("back"), algorithmListSize, userId, projectId);
                job.setFinish(true);
            } else {
                objectList = new ArrayList<>();
                for (JSONObject algorithm : algorithmList) {
                    JSONObject temp = new JSONObject();
                    temp.put("algorithm", algorithm.get("algorithm"));
                    temp.put("inputList", algorithm.get("inputList"));
                    objectList.add(temp);
                }
                if (jsonObject1.get("sign").equals("stop")) {
                    job.setShutdown(true);
                } else {
                    job.setError(true);
                }
            }
            job.setRun(false);
            back.put("back", objectList);

            JobOutput jobOutput = new JobOutput();
            jobOutput.setInfo(objectList);
            jobOutput.setSign((String) jsonObject1.get("sign"));
            jobOutput.setProject((Project) redisUtil2.hget(jobId, "project"));
            jobOutput.setUserId((String) redisUtil2.hget(jobId, "userId"));
            JobOutput jobOutputTemp = jobOutputRepository.save(jobOutput);
            List<Object> objects = redisUtil3.lGet(jobId, 0, -1);
            objects.remove(objects.size() - 1);
            List<String> stringList = new ArrayList<>();
            for (Object o : objects) {
                stringList.add(o.toString());
            }
            JobRunInfo jobRunInfo = new JobRunInfo();
            jobRunInfo.setInfo(stringList);
            JobRunInfo jobRunInfoTemp = jobRunInfoRepository.save(jobRunInfo);

            job.setOutputMongoId(jobOutputTemp.getId());
            job.setRunInfoMongoId(jobRunInfoTemp.getId());

            jobRepository.save(job);

            redisUtil2.hset(jobId, "save", 1);

            while (redisUtil2.hHasKey(jobId, "websocket")) {
                try {
                    Thread.sleep(1);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

            redisUtil2.del(jobId);
            redisUtil3.del(jobId);
        }
    }

    @Override
    public void runAlgorithm(String jobId) {
        Thread t = new ThreadRunAlgorithm();
        ((ThreadRunAlgorithm) t).setJobId(jobId);
        t.start();
    }

    @Override
    public String createJob(JSONObject object) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String projectId = (String) object.get("projectId");
        String userId = (String) object.get("userId");

        List<JSONObject> algorithmList = InputProcess((List<JSONObject>) object.get("algorithmList"));

        StringBuilder algorithmName = new StringBuilder();
        String navigationParentId = null;
        for (JSONObject jsonObject : algorithmList) {
            Algorithm algorithm = (Algorithm) jsonObject.get("algorithm");
            if (navigationParentId == null) {
                navigationParentId = algorithm.getNavigationParentId();
            }
            algorithmName.append(algorithm.getAlgorithmName());
            algorithmName.append(",");
        }
        String algorithmNameTemp = algorithmName.toString();
        algorithmNameTemp = algorithmNameTemp.substring(0, algorithmNameTemp.length() - 2);

        Job job = new Job(format.format(new Date()), algorithmNameTemp, userId, projectId, navigationParentId, true, false, false, false, true);
        job = jobRepository.save(job);
        String jobId = job.getId();
        redisUtil2.hset(jobId, "job", job);
        redisUtil2.hset(jobId, "algorithmList", algorithmList);
        redisUtil2.hset(jobId, "userId", userId);
        redisUtil2.hset(jobId, "finish", 0);
        redisUtil2.hset(jobId, "project", projectRepository.findById(projectId).orElse(null));
        redisUtil2.hset(jobId, "userId", userId);
        return job.getId();
    }

    @Override
    public boolean checkRun(String jobId, String userId) {
        Job job = jobRepository.findByIdAndUserId(jobId, userId);

        return job != null && job.isRun();
    }

    @Override
    public boolean checkJob(String jobId, String userId) {
        return jobRepository.findByIdAndUserId(jobId, userId) != null;
    }

    @Override
    public String getRunJobInfo(String jobId) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("job", redisUtil2.hget(jobId, "job"));
        jsonObject.put("algorithmList", redisUtil2.hget(jobId, "algorithmList"));
        jsonObject.put("project", redisUtil2.hget(jobId, "project"));

        return jsonObject.toJSONString();
    }

    @Override
    public JSONObject getFinishJobInfo(String jobId) {
        while (redisUtil2.hasKey(jobId)) {
            if (!redisUtil2.hhaskey(jobId, "save")) {
                break;
            }
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        Job job = jobRepository.findById(jobId).orElse(null);
        JSONObject jsonObject = new JSONObject();
        if (job != null) {
            JobOutput jobOutput = jobOutputRepository.findAllById(job.getOutputMongoId());
            JobRunInfo jobRunInfo = jobRunInfoRepository.findAllById(job.getRunInfoMongoId());
            jsonObject.put("jobOutputMongo", jobOutput);
            jsonObject.put("jobRunInfoMongo", jobRunInfo);
            jsonObject.put("sign", true);
        } else {
            jsonObject.put("sign", false);
        }
        System.out.println(jsonObject);
        return jsonObject;
    }

    @Override
    public Job findByIdAndUserId(String jobId, String userId) {
        return jobRepository.findByIdAndUserId(jobId, userId);
    }

    @Override
    public JSONObject shutdownJobInitiative(String jobId) {
        int i = 0;
        while (!redisUtil2.hasKey(jobId)) {
            if (i > 3000) {
                break;
            }
            i+=10;
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        i = 0;
        while (!redisUtil2.hhaskey(jobId, "algorithm_pid")) {
            if (i > 3000) {
                break;
            }
            i+=10;
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        JSONObject back = new JSONObject();

        if (jobRepository.findById(jobId).orElse(null) != null) {
            String pid = redisUtil2.hget(jobId, "algorithm_pid").toString();
            if (pid != null) {
                redisUtil2.hset(jobId, "stop", 1);
                back = threadHelper.killProcessByPid(pid);
            } else {
                back.put("sign", false);
                back.put("tip", "任务执行结束，请前往任务页面查看详情！");
            }


        } else {
            back.put("sign", false);
            back.put("tip", "任务不存在！");
        }
        return back;
    }

    @Override
    public JSONObject shutdownJobPassivity(String jobId) {
        int i = 0;
        while (!redisUtil2.hasKey(jobId)) {
            if (i > 6000) {
                break;
            }
            i++;
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        i = 0;
        while (!redisUtil2.hhaskey(jobId, "algorithm_pid")) {
            if (i > 6000) {
                break;
            }
            i++;
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        JSONObject back = new JSONObject();
        if (findByIdAndUserId(jobId, (String) redisUtil2.hget(jobId, "userId")) != null) {
            String pid = redisUtil2.hget(jobId, "algorithm_pid").toString();
            if ((Integer) redisUtil2.hget(jobId, "finish") == 0) {
                redisUtil2.hset(jobId, "stop", 1);
                back = threadHelper.killProcessByPid(pid);
            }
        }
        return back;
    }

    @Override
    public List<JSONObject> OutputProcess(JSONObject jsonObject, Integer algorithmListSize, String userId, String projectId) {
        List<JSONObject> jsonObjectList = new ArrayList<>();
        for (int i = 0; i < algorithmListSize; i++) {
            JSONObject temp = new JSONObject();
            temp.put("displayList", displayService.findDisplayListByAlgorithmId((String) JSON.parseObject((String) jsonObject.get("algorithm_" + i)).get("id")));
            temp.put("outputList", jsonObject.get("outputList_" + i));
            temp.put("inputList", jsonObject.get("inputList_" + i));
            temp.put("algorithm", jsonObject.get("algorithm_" + i));
            temp.put("state", jsonObject.get("state_" + i));
            temp.put("start", jsonObject.get("start_" + i));
            temp.put("end", jsonObject.get("end_" + i));
            temp.put("costTime", jsonObject.get("cost_time_" + i));
            temp.put("costFormat", jsonObject.get("cost_format_" + i));
            jsonObjectList.add(temp);
        }

        return jsonObjectList;
    }

    @Override
    public List<JSONObject> InputProcess(List<JSONObject> algorithmList) {
        InputType inputTypeSet = inputTypeRepository.findByInputKeyOrderByOrderNumAsc("set");
        InputType inputTypeFile = inputTypeRepository.findByInputKeyOrderByOrderNumAsc("file");
        List<JSONObject> backAlgorithmList = new ArrayList<>();
        for (JSONObject algorithm : algorithmList) {
            JSONObject backJson = new JSONObject();
            String algorithm_id = (String) algorithm.get("algorithm_id");
            JSONObject inputList = (JSONObject) algorithm.get("inputList");
            JSONObject matKey = (JSONObject) algorithm.get("matKey");
            Algorithm algorithm1 = algorithmRepository.findById(algorithm_id).orElse(null);
            List<Algorithm> a = new ArrayList<>();
            a.add(algorithm1);
            algorithm1 = AlgorithmHelp(a).get(0);
            List<Input> inputSet = inputRepository.findAllByAlgorithmIdAndInputTypeId(algorithm_id, inputTypeSet.getId());
            List<Input> inputFile = inputRepository.findAllByAlgorithmIdAndInputTypeId(algorithm_id, inputTypeFile.getId());

            List<String> inputSetList = new ArrayList<>();
            List<String> inputFileList = new ArrayList<>();

            for (Input input : inputSet) {
                inputSetList.add(input.getInputKey());
            }
            for (Input input : inputFile) {
                inputFileList.add(input.getInputKey());
            }
            backJson.put("algorithm", algorithm1);
            backJson.put("inputSetList", inputSetList);
            backJson.put("inputFileList", inputFileList);
            backJson.put("inputList", inputList);
            backJson.put("matKey", matKey);
            backAlgorithmList.add(backJson);
        }

        return backAlgorithmList;
    }

    @Override
    public List<Job> findAllByUserId(String userId) {
        List<NavigationParent> navigationList = navigationParentRepository.findAllByActivateOrderByOrderNumAsc(true);
        List<Job> jobList = jobRepository.findAllByUserIdOrderByCreateTimeDesc(userId);
        for (Job job : jobList) {
            for (NavigationParent navigationParent : navigationList) {
                if (job.getNavigationId().equals(navigationParent.getId())) {
                    job.setNavigationName(navigationParent.getNavigationName());
                    break;
                }
            }
        }
        return jobList;
    }

    @Override
    public List<Object> syncRunInfo(String jobId, long start) {
        long len = redisUtil3.lGetListSize(jobId);

        if ((len - 1) <= start) {
            return null;
        }

        return redisUtil3.lGet(jobId, start, len - 1);
    }

    @Override
    public String getFirstJobId(String userId) {
        return jobRepository.findFirstByUserIdOrderByCreateTimeDesc(userId).getId();
    }


    private List<Algorithm> AlgorithmHelp(List<Algorithm> algorithmList) {
        Set<String> userSet = new HashSet<>();
        Set<String> navigationSet = new HashSet<>();
        Set<String> engineSet = new HashSet<>();
        Set<String> environmentSet = new HashSet<>();
        for (Algorithm algorithm : algorithmList) {
            userSet.add(algorithm.getUserId());
            navigationSet.add(algorithm.getNavigationParentId());
            String engine = algorithm.getAlgorithmEngineId();
            engineSet.add(engine);
            environmentSet.add(algorithm.getAlgorithmEnvironmentId());
        }
        List<User> userList = userRepository.findAllByIdIn(userSet);
        List<NavigationParent> navigationList = navigationParentRepository.findAllByIdIn(navigationSet);
        List<AlgorithmEngine> engineList = algorithmEngineRepository.findAllByIdInAndActivate(engineSet, true);
        List<AlgorithmEnvironment> algorithmEnvironmentList = algorithmEnvironmentRepository.findAllByIdInAndActivate(environmentSet, true);
        JSONObject engineJSON = new JSONObject();
        for (AlgorithmEngine algorithmEngine : engineList) {
            engineJSON.put(algorithmEngine.getId(), algorithmEngine.getEngineName());
        }
        for (Algorithm algorithm : algorithmList) {
            if (algorithm.getAlgorithmType().equals("base")) {
                algorithm.setUserName("官方");
            }

            algorithm.setAlgorithmEngine((String) engineJSON.get(algorithm.getAlgorithmEngineId()));

            for (AlgorithmEnvironment algorithmEnvironment : algorithmEnvironmentList) {
                if (algorithmEnvironment.getId().equals(algorithm.getAlgorithmEnvironmentId())) {
                    algorithm.setAlgorithmEnvironment(algorithmEnvironment.getAlgorithmEnvironmentName());
                }
            }
            for (NavigationParent navigationParent : navigationList) {
                if (navigationParent.getId().equals(algorithm.getNavigationParentId())) {
                    algorithm.setNavigationParent(navigationParent);
                }
            }
        }
        return algorithmList;
    }
}
