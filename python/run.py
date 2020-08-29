import sys, json, importlib, redis, os, datetime

jobId = sys.argv[1]
index = sys.argv[2]
algorithmPath = sys.argv[3]
r10 = redis.StrictRedis(host='192.168.100.20', port=6379, db=10, decode_responses=True)


def run(jobId, index, algorithmPath):
    r10.hset(jobId, 'algorithm_pid', os.getpid())
    a = r10.hget(jobId, 'algorithm_' + str(index))
    b = r10.hget(jobId, 'inputList_' + str(index))
    # a = str(a, encoding='utf-8')
    # b = str(b, encoding='utf-8')
    a = json.loads(a)
    b = json.loads(b)

    sys.path.insert(0, algorithmPath + a['algorithmType'] + "\\" + a['algorithmPath'])
    print(algorithmPath + a['algorithmPath'])
    c = a['algorithmFile']
    c_temp = c.split(".")
    c = c[0:-len(c_temp[len(c_temp) - 1]) - 1]
    print(c)
    d = a['algorithmRun']

    aa = importlib.import_module(c)
    aa = importlib.reload(aa)

    data1 = datetime.datetime.now()

    e = eval('aa.' + d + '(**' + str(b) + ')')

    data2 = datetime.datetime.now()
    start = data1.strftime('%Y-%m-%d %H:%M:%S')
    end = data2.strftime('%Y-%m-%d %H:%M:%S')

    r10.hset(jobId, 'outputList_' + str(index), json.dumps(e, ensure_ascii=False))

    cost_time = int((data2 - data1).total_seconds() * 1000)
    cost_format = format_time(cost_time)

    r10.hmset(jobId, {"start_" + str(index): start,
                      "end_" + str(index): end,
                      "cost_time_" + str(index): cost_time,
                      "cost_format_" + str(index): cost_format})


def format_time(cost_time):
    if cost_time < 1000:
        return str(cost_time) + "ms"

    milli = cost_time % 1000
    cost_time = int(cost_time / 1000)

    if cost_time < 60:
        return str(cost_time) + "s " + str(milli) + "ms"

    seconds = cost_time % 60
    cost_time = int(cost_time / 60)

    if cost_time < 60:
        return str(cost_time) + "m " + str(seconds) + "s " + str(milli) + "ms"

    minute = cost_time % 60
    cost_time = int(cost_time / 60)

    return str(cost_time) + "h " + str(minute) + "m " + str(seconds) + "s " + str(milli) + "ms"


if __name__ == '__main__':
    run(jobId, index, algorithmPath)
