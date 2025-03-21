from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('user/', views.get_user, name='get_user'),
    path('update_weak_topics/', views.update_weak_topics, name='update_weak_topics'),
    path('update_total_marks/', views.update_total_marks, name='update_total_marks'),
]
