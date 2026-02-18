def greater_first(func):
    def wrapper(a,b):
        if a>b:
            return func(a,b)
        else:
            return func(b,a)
    return wrapper


@greater_first
def divide(a,b):
    return a/b

@greater_first
def sub(a,b):
    return a-b

div=greater_first(divide)
res=div(10,50 )
subt=greater_first(sub)
res1=subt(10,160)

print(res)
print(res1)

















































































