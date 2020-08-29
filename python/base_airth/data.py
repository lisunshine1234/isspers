import numpy as np


def result_help(result, outputList):
    keySet = []
    for output in outputList:
        keySet.append(output["outputType"])
    #
    #     new_dict = {}
    #     new_outputList = []
    #
    if 'clf' in keySet:
        index = keySet.index('clf')
        result.pop(outputList[index]["outputKey"])
        # outputList.pop(index)
    #
    #     if 'set_train' in keySet:
    #         index = keySet.index('set_train')
    #         key = outputList[index]["outputKey"]
    #         new_dict[key] = result[key]
    #
    #     elif 'x_train' in keySet and 'y_train' in keySet:
    #         index1 = keySet.index('x_train')
    #         index2 = keySet.index('y_train')
    #         key1 = outputList[index1]["outputKey"]
    #         key2 = outputList[index2]["outputKey"]
    #
    #
    #         new_dict[]
    #         result['set_train'](np.hstack((x_train, y_train.reshape(y_train.shape[0], 1))))
    #
    #         outputList.remove(index1)
    #         outputList.remove(index2)
    #
    #     if 'set_test' in keySet:
    #         if 'x_test' in keySet:
    #             index = keySet.index('x_test')
    #             result.pop(outputList[index]["outputKey"])
    #             outputList.remove(index)
    #         if 'y_test' in keySet:
    #             index = keySet.index('y_test')
    #             result.pop(outputList[index]["outputKey"])
    #             outputList.remove(index)
    #
    #     elif 'x_test' in keySet and 'y_test' in keySet:
    #         index1 = keySet.index('x_test')
    #         index2 = keySet.index('y_test')
    #         x_train = outputList[index1]["outputKey"]
    #         y_train = outputList[index2]["outputKey"]
    #         result['set_test'](np.hstack((x_train, y_train.reshape(y_train.shape[0], 1))))
    #         outputList.remove(index1)
    #         outputList.remove(index2)
    #
    #     if 'set_test' in keySet and 'predict' in keySet:
    #         x_train = outputList[keySet.index('x_test')]["outputKey"]
    #         y_train = outputList[keySet.index('y_test')]["outputKey"]
    #         result['set_test'](np.hstack((x_train, y_train.reshape(y_train.shape[0], 1))))
    #
    return result


def numpyToList(result):
    for j in result:
        if isinstance(result[j], dict):
            result[j] = numpyToList(result[j])
        elif str(type(result[j])).__contains__("numpy"):
            result[j] = result[j].tolist()
    return result


def result_process(result, outputList):
    keySet = []
    for output in outputList:
        keySet.append(output["outputType"])
    new_dict = {}
    new_outputList = []
    back = None
    for key in keySet:
        index = keySet.index(key)
        if key == "x_train":
            back = data_process(result[outputList[index]["outputKey"]])
        if key == "set":
            back = data_process(result[outputList[index]["outputKey"]])
        elif key == "y_train":
            back = label_process(result[outputList[index]["outputKey"]])
        elif key == "x_test":
            back = data_process(result[outputList[index]["outputKey"]])
        elif key == "y_test":
            back = label_process(result[outputList[index]["outputKey"]])
        elif key == "set_train":
            back = set_process(result[outputList[index]["outputKey"]])
        elif key == "set_test":
            back = set_process(result[outputList[index]["outputKey"]])
        elif key == "score":
            back = score_process(result[outputList[index]["outputKey"]])
        elif key == "test_predict":
            back = label_process(result[outputList[index]["outputKey"]])
        elif key == "train_predict":
            back = label_process(result[outputList[index]["outputKey"]])
        elif key == "clf":
            back = clf_process(result[outputList[index]["outputKey"]])

        if back is not None:
            new_dict[outputList[index]["outputKey"]] = back
            new_outputList.append(outputList[index])

    return new_dict, new_outputList


def set_process(in_set):
    in_set = np.array(in_set)
    if len(in_set.shape) == 2:
        if len(in_set[0]) < 3:
            return None
        return in_set
    return None


def data_process(in_data):
    in_data = np.array(in_data)
    if len(in_data.shape) == 2:
        if len(in_data[0]) < 2:
            return None
        return in_data
    return None


def label_process(in_label):
    in_label = np.array(in_label)
    if len(in_label.shape) == 2:
        if len(in_label[0]) == 1:
            return in_label[:, 0]
        return None
    elif len(in_label.shape) == 1:
        return in_label
    return None


def score_process(score):
    if isinstance(score, float) or isinstance(score, int):
        return score
    return None


def clf_process(clf):
    classifyName = ["KNeighborsClassifier", "SVC", "QuadraticDiscriminantAnalysis", "LinearDiscriminantAnalysis", "GaussianNB", "MultinomialNB", "AdaBoostClassifier", "GradientBoostingClassifier",
                    "DecisionTreeClassifier", "RandomForestClassifier", "LogisticRegression"]
    if str(clf).split("(")[0] in classifyName:
        return clf
    return None
