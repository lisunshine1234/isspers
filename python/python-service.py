import importlib
import json
import copy
import time
import datetime
from flask import Flask, Response, request
from multiprocessing import Process
import os
import base_airth.data as da
import base_airth.read as rd
import base_airth.show as sh
import redis
import threading
import sys, io
import subprocess
from util.timeHelper import *

app = Flask(__name__)
r10 = redis.StrictRedis(host='192.168.100.20', port=6379, db=10, decode_responses=True)
r11 = redis.StrictRedis(host='192.168.100.20', port=6379, db=11, decode_responses=True)
s = ""


@app.route('/run', methods=['POST', 'GET'])
def sync():
    param = request.get_json()
    jobId = param["jobId"]
    algorithmList = json.loads(param["algorithmList"])
    algorithmPath = param["algorithmPath"]
    dataPath = param["dataPath"]
    sys.path.insert(0, algorithmPath)

    index = 0
    state = False
    r10.hset(jobId, "stop", 0)
    for algorithm in algorithmList:
        if int(r10.hget(jobId, "stop")) == 1:
            break
        a = run_algorithm(algorithm, jobId, algorithmPath, dataPath, index)
        state = a.run()
        if state["sign"] != "success":
            break
        index = index + 1

    r10.hset(jobId, "finish", 1)
    r11.rpush(jobId, json.dumps("#done", ensure_ascii=False))

    back = r10.hgetall(jobId)
    return Response(json.dumps({"state": state, "back": back}), mimetype='application/json')


class run_algorithm():
    def __init__(self, algorithm, jobId, algorithmPath, dataPath, index):
        self.algorithm = algorithm
        self.jobId = jobId
        self.algorithmPath = algorithmPath
        self.dataPath = dataPath
        self.index = index

    def run(self):
        try:
            algorithm = self.algorithm["algorithm"]
            inputSetList = self.algorithm["inputSetList"]
            inputFileList = self.algorithm["inputFileList"]
            inputList = self.algorithm["inputList"]
            matKey = self.algorithm["matKey"]

            inputList_temp = copy.deepcopy(inputList)

            for input in inputSetList:
                if input in matKey:
                    inputList[input] = rd.getInfo(self.dataPath + inputList[input], matKey[input])
                else:
                    inputList[input] = rd.getInfo(self.dataPath + inputList[input], None)

            for input in inputFileList:
                if input in matKey:
                    inputList[input] = {input: self.dataPath + inputList[input], str(input) + "_mat": matKey[input]}
                else:
                    inputList[input] = {input: self.dataPath + inputList[input], str(input) + "_mat": None}

            r10.hset(self.jobId, "inputList_" + str(self.index), json.dumps(inputList, ensure_ascii=False))
            r10.hset(self.jobId, "algorithm_" + str(self.index), json.dumps(algorithm, ensure_ascii=False))

            order = self.run_order()

            sign = True

            r11.rpush(self.jobId,
                      json.dumps("<font style='color:black;'><b>[Starting]</b> " +
                                 datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') + " : " + algorithm["algorithmName"] +
                                 " is running!</font><br>",
                                 ensure_ascii=False))
            r11.rpush(self.jobId, json.dumps("<font style='color:black;'><b>[Parameters]</b> The parameters is: " + str(inputList_temp) + "</font><br>", ensure_ascii=False))

            p = subprocess.Popen(order, shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            for line in iter(p.stdout.readline, b''):
                r11.rpush(self.jobId, json.dumps("<font style='color:black;'><b>[Running]</b> " + line.decode('utf-8', 'ignore') + "</font><br>", ensure_ascii=False))
            for line in iter(p.stderr.readline, b''):
                if sign:
                    sign = False
                r11.rpush(self.jobId, json.dumps("<font style='color:red;'><b>[Error]</b> " + line.decode('utf-8', 'ignore') + "</font><br>", ensure_ascii=False))

            r10.hset(self.jobId, 'inputList_' + str(self.index), json.dumps(inputList_temp, ensure_ascii=False))

            if int(r10.hget(self.jobId, "stop")) == 1:
                sign = "stop"
                r11.rpush(self.jobId, json.dumps("<font style='color:blue;'><b>[Stop]</b> " + datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') + " : " +
                                                 algorithm["algorithmName"] + " have be stopped!</font><br>", ensure_ascii=False))
            else:
                if sign:
                    sign = "success"
                    r11.rpush(self.jobId, json.dumps("<font style='color:black;'><b>[Finished]</b> " +
                                                     datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S') + " : " + algorithm["algorithmName"] + " have finished!</font><br>",
                                                     ensure_ascii=False))
                else:
                    sign = "algorithm_error"

            return {"sign": sign}
        except Exception as e:
            r10.hset(self.jobId, "finish", 1)
            r10.hset(self.jobId, "stop", 1)
            r11.rpush(self.jobId, json.dumps("<font style='color:red;'><b>[Error]</b> " + str(e) + "</font><br>", ensure_ascii=False))
            return {"sign": "system_error", "tip": str(e)}

    def run_order(self):
        order = "python " + self.algorithmPath + "run.py " + str(self.jobId) + " " + str(self.index) + " " + self.algorithmPath
        return order


@app.route("/health")
def health():
    result = {'status': 'UP'}
    return Response(json.dumps(result), mimetype='application/json')


app.run(port=3000, host='0.0.0.0')
