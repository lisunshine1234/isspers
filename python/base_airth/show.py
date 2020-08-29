import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_moons, make_circles, make_classification
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import csv
import base64
import urllib
import base_airth.pca as pca
import numpy as np

import numpy as np
import base_airth.pca as pca
import base_airth.data as da


def show_help(result, outputList):
    new_key = {}
    for output in outputList:
        new_key[output["outputType"]] = result[output["outputKey"]]

    back_show = {}

    if new_key.__contains__('x_train') and new_key.__contains__('y_train'):
        x_train = new_key['x_train']
        y_train = new_key['y_train']
        back_show["train"] = get_data_distribute(x_train, y_train)

    elif new_key.__contains__("set_train"):
        set_train = new_key['set_train']
        back_show["train"] = get_data_distribute(set_train[:, 0:-1], set_train[:, -1])

    if new_key.__contains__('x_test') and new_key.__contains__('y_test'):
        x_test = new_key['x_test']
        y_test = new_key['y_test']
        back_show["test"] = get_data_distribute(x_test, y_test)

    elif new_key.__contains__("set_test"):
        set_test = new_key['set_test']
        back_show["test"] = get_data_distribute(set_test[:, 0:-1], set_test[:, -1])

    if new_key.__contains__("score"):
        back_show["score"] = new_key["score"]

    if new_key.__contains__("predict"):
        back_show["predict"] = new_key["predict"]

    if back_show.__contains__("test") and back_show.__contains__("train"):
        back_show["train_and_test"] = {"train": back_show["train"], "test": back_show["test"]}

        back_show.pop("train")
        back_show.pop("test")

    if new_key.__contains__("x_train") and new_key.__contains__("y_train") and new_key.__contains__('x_test') and new_key.__contains__('y_test') and new_key.__contains__('clf'):
        back_show["tt_predict"] = show_all(clf=new_key["clf"], x_train=new_key["x_train"], y_train=new_key["y_train"], x_test=new_key["x_test"], y_test=new_key["y_test"])
    elif new_key.__contains__("set_train") and new_key.__contains__("set_test") and new_key.__contains__('clf'):
        back_show["tt_predict"] = show_all(clf=new_key["clf"], set_train=new_key["set_train"], set_test=new_key["set_test"])

    return back_show


def get_data_distribute(input_set, input_label):
    dict = {}

    new_set = pca.pca(input_set, 2)
    set_label = np.hstack((new_set, input_label.reshape(input_label.shape[0], 1)))

    label_type = np.unique(input_label)

    for i in label_type:
        dict[str(i)] = set_label[input_label == i][:, [0, 1]].tolist()
    return dict

def show_all(clf, x_train=None, y_train=None, x_test=None, y_test=None, set_train=None, set_test=None):
    figure = plt.figure(figsize=(18, 9))
    color = np.array(["#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#FF00FF", "#00FFFF"])
    if set_train != None and set_test != None:
        x_train = set_train[:, 0:-1]
        y_train = set_train[:, -1]
        x_test = set_test[:, 0:-1]
        y_test = set_test[:, -1]

    # clf.n_jobs = -1
    # x_train_new = []
    #
    # for i in range(len(x_train[0])):
    #     if x_train[:, i].max() > 1:
    #         np.c_[x_train_new, StandardScaler().fit_transform(x_train[:, i])]
    #     else:
    #         np.c_[x_train_new, x_train[:, i]]


    X = np.vstack((x_train, x_test))
    X, redEigVects, meanVals = pca.pca_back(X, 2)

    x_test_temp = x_test
    x_train = X[range(len(x_train)), :]
    x_test = X[range(len(x_train), len(X)), :]

    x_min, x_max, y_min, y_max = X[:, 0].min(), X[:, 0].max(), X[:, 1].min(), X[:, 1].max()
    h = (x_max - x_min) / 20

    x_min, x_max, y_min, y_max = x_min - h, x_max + h, y_min - h, y_max + h
    h = (x_max - x_min) / 100

    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))

    Z = clf.predict((np.c_[xx.ravel(), yy.ravel()] * redEigVects) + meanVals)
    Z = Z.reshape(xx.shape)

    Z_temp = np.unique(Z)
    cm_bright = ListedColormap(color[:len(np.unique(Z))])

    y_train_temp = np.setxor1d(y_train, Z_temp)
    y_test_temp = np.setxor1d(y_test, Z_temp)

    score = clf.score(x_test_temp, y_test)
    # print(Z_temp)
    # print(np.sum(Z == 0))
    # print(np.sum(Z == 1))
    # print(np.sum(Z == 2))
    # print(np.sum(Z == 3))
    # print(np.sum(Z == 4))
    # print(clf.predict(x_test_temp))
    plt.subplot(2, 1, 1)
    plt.contourf(xx, yy, Z, cmap=cm_bright, alpha=0.6)
    # plt.colorbar()
    # plt.scatter(x_train[:, 0], x_train[:, 1], c=y_train,cmap=cm_bright, edgecolors='k')
    num = 0
    for i in Z_temp:
        plt.scatter(x_train[y_train == i][:, 0], x_train[y_train == i][:, 1], c=color[num], edgecolors='k', label=i)
        num = num + 1

    for i in y_train_temp:
        plt.scatter(x_train[y_train == i][:, 0], x_train[y_train == i][:, 1], c=color[num], edgecolors='k', label=i)
        num = num + 1

    plt.xlim(xx.min(), xx.max())
    plt.ylim(yy.min(), yy.max())

    plt.xticks(())
    plt.yticks(())

    plt.legend(loc=0)

    plt.title(str(clf).split("(")[0] + '--train predict:' + str(score))

    plt.subplot(2, 1, 2)
    plt.contourf(xx, yy, Z, cmap=cm_bright, alpha=0.6)
    # plt.colorbar()
    num = 0
    for i in Z_temp:
        plt.scatter(x_test[y_test == i][:, 0], x_test[y_test == i][:, 1], c=color[num], edgecolors='k', label=i)
        num = num + 1
    for i in y_test_temp:
        plt.scatter(x_test[y_test == i][:, 0], x_test[y_test == i][:, 1], c=color[num], edgecolors='k', label=i)
        num = num + 1

    plt.xlim(xx.min(), xx.max())
    plt.ylim(yy.min(), yy.max())
    plt.xticks(())
    plt.yticks(())
    plt.legend(loc=0)
    plt.title(str(clf).split("(")[0] + '--test predict:' + str(score))

    # 写入内存
    save_file = BytesIO()
    plt.savefig(save_file, format='png')

    # 转换base64并以utf8格式输出
    save_file_base64 = base64.b64encode(save_file.getvalue()).decode('utf8')

    return "data:image/png;base64," + save_file_base64
