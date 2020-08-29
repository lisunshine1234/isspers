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
