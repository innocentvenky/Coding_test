from django.urls import path
from . views import StudentDelete,Student_Result_Update,loginpage
from .views import StudentRegisterData
from . views import StudentRegistation
from .views import testpage
from . views import submit_test
#ending points

urlpatterns=[
    path('',StudentRegisterData,name='register'),
    path("rigistation/",StudentRegistation,name='registation'),
    path('delete/<str:student_email>/',StudentDelete,name='delete'),
    path('update/<str:student_email>/',Student_Result_Update,name='update'),
    path("login/",loginpage,name='login'),
    path("testpage/",testpage,name='testpage'),
    path("submit/", submit_test, name="submit"),

]