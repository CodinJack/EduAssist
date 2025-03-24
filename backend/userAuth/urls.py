from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('user/', views.get_user, name='get_user'),
    path('all_users/', views.get_all_users, name="get_all_users"),
    path('get_user_from_cookie/', views.get_user_from_cookie, name="get_user_from_cookie"),
    path('update_weak_topics/', views.update_weak_topics, name='update_weak_topics'),
    path('update_total_marks/', views.update_total_marks, name='update_total_marks'),
    path('update_bookmarked_questions/', views.update_bookmarked_questions, name='update_bookmarked_questions'),
]
