from scipy.io import loadmat
import numpy as np


def getInfo(file, matKey):
    file_type_list = file.split(".")
    file_type = file_type_list[len(file_type_list) - 1]

    if file_type == 'mat':
        back = read_mat(file, matKey)
    elif file_type == 'csv':
        back = read_csv(file)
    elif file_type == 'txt':
        back = read_txt(file)
    else:
        back = None

    return back.tolist()


def read_mat(file, matKey):
    m = loadmat(file)
    # m.pop("__header__")
    # m.pop("__version__")
    # m.pop("__globals__")
    # for key in m.keys():
    #     m[key] = np.array(m[key], dtype=float)
    return m[matKey]


def read_csv(file):
    set = np.loadtxt(file, delimiter=',')
    return np.array(set, dtype=float)


def read_txt(file):
    data = np.loadtxt(file, delimiter=',')
    return np.array(data, dtype=float)
