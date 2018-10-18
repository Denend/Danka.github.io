# -*- coding: utf-8 -*-
from flask import render_template, url_for, redirect, flash, session, request, jsonify, send_from_directory, send_file, Response
from app import app, db
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Answer, Question
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.urls import url_parse
from json import dumps


@app.route('/')
@app.route('/home')
def home():
    num_of_users = str(len(User.query.all()))
    name = User.query.filter_by(id=1).first()
    return render_template('home.html', title='Home', num_of_users=num_of_users, name=name)


@app.route('/_opros_process', methods=['GET', 'POST'])
def opros_process():
    #THe return type must be a str, tuple response instance, or WSGI callable
    if request.method == 'POST':
        ans = request.get_json()
        for key in ans:
           q = Question.query.get(int(key))
           answer = Answer(qstion=q, author=current_user, ans=ans[key]['result'])
           db.session.add(answer)
        db.session.commit()
        result = {}
        for i in range(1, 10):
            result[i] = Answer.query.filter_by(ans=True, question_id=i).count()
        return jsonify(result)


@app.route('/opros')
@login_required
def opros():
    a = Answer.query.filter_by(user_id=current_user.id).count()
    if a > 0:
        flash('Survey was already completed', 'info')
        return redirect(url_for('home'))
    return render_template('opros.html', title='Survey')


@app.route('/_statistics_process', methods=['GET', 'POST'])
def statistics_process():
    result = {}
    for i in range(1, 10):
        result[i] = Answer.query.filter_by(ans=True, question_id=i).count()
    return jsonify(result)


@app.route('/statistics')
@login_required
def statistic():
    a = Answer.query.filter_by(user_id=current_user.id).count()
    if a == 0:
        flash('Please complete the survey first, to see statistic', 'info')
        return redirect(url_for('opros'))
    return render_template('statistic.html', title='Take a look at that!')


@app.route('/about_us')
def about_us():
    return render_template('about_us.html', title='About us')


@app.route('/f_y_process', methods=['GET', 'POST'])
def f_y_process():
    result = request.get_json()
    u = User.query.filter_by(id=current_user.id).first()
    if int(result['count']) > u.f_y_record:
        u.f_y_record = int(result['count'])
        db.session.commit()
    top3 = User.query.filter(User.f_y_record>=0).order_by(User.f_y_record.desc())[:3]
    top3dic = {}
    for div_id, i in enumerate(reversed(top3)):
        top3dic[i.f_y_record] = [i.username, div_id]
    return dumps(top3dic, indent=2, sort_keys=True)


# Flappy Yuras view
@app.route('/flappy_yuras')
@login_required
def flappy_yuras():
    top3ls = []
    for i in range(3):
        top = User.query.filter(User.f_y_record>=0).order_by(User.f_y_record.desc())[i:i+1]
        for u in top:
            top3ls.append(u.username)
            top3ls.append(u.f_y_record)
    return render_template('flappy_yuras.html', top1name=top3ls[0], top1score=top3ls[1],
                                                top2name=top3ls[2], top2score=top3ls[3],
                                                top3name=top3ls[4], top3score=top3ls[5])


#User Login
@app.route('/login', methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    if request.method == 'POST':
        # get forms  fields
        username = request.form['username']
        password = request.form['password']
        remember_me = request.form.get('remember_me')
        if remember_me is not None:
            remember_me = True
        else:
            remember_me = False

        user = User.query.filter_by(username=username).first()
        if user is None or not user.check_password(password):
            flash('Username or password is incorrect', 'danger')
            return redirect(url_for('login'))
        # Passed
        session['logged_in'] = True
        session['username'] = username
        login_user(user, remember=remember_me)
        flash('you are now logged in', 'success')
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('home')
        return redirect(next_page)
    return render_template('login.html', title='PLease login')


# Logout
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You are now logged out', 'success')
    return redirect(url_for('home'))


# User Register
@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user is not None:
            flash('Someone has already registered with this username', 'danger')
            return redirect(url_for('register'))
        else:
            u = User(username=username)
            u.set_password(password)
            db.session.add(u)
            db.session.commit()
            flash('Congratulations, you are now a registred user!', 'success')
            return redirect(url_for('login'))
    return render_template('register.html', title='Register')

