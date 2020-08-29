import psutil


def processPort(pid):
    p = psutil.Process(pid)
    data = p.connections()
    data_listen = [x for x in data if 'LISTEN' in x]
    # pid_port=[]
    # for port in data_listen:
    #     pid_port.append((port.laddr.port))
    # return list(set(pid_port))
    return list(data_listen[0][3])[1]
