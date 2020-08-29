import csv
from scipy.io import savemat


def run(file, data):
    file_type_list = file.split(".")
    file_type = file_type_list[len(file_type_list) - 1]
    try:
        if file_type == 'mat':
            save_mat(file, data)
        elif file_type == 'csv':
            save_csv(file, data)
        elif file_type == 'txt':
            save_txt(file, data)
    except Exception as e:
        return e


def save_csv(file, data):
    with open(file, 'w', newline='') as file_csv:
        write_csv = csv.writer(file_csv)
        write_csv.writerows(data)


def save_txt(file, data):
    with open(file, 'w', newline='') as file_csv:
        write_csv = csv.writer(file_csv)
        write_csv.writerows(data)


def save_mat(file, data):
    savemat(file, data)
