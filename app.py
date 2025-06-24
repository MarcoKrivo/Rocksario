from flask import Flask, render_template, url_for, redirect, request, session,flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'TUP6'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///formulario.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Registro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(100))
    password = db.Column(db.String(100))
    email = db.Column(db.String(100)) 
    telefono = db.Column(db.String(20))
    es_admi = db.Column(db.Boolean, default=False)

@app.route('/form', methods=['GET', 'POST'])
def formulario():
    return render_template('form.html')

@app.route('/registrar', methods=['POST'])
def registrar():
    print("Formulario recibido")
    nuevo_registro = Registro(
        user_name=request.form['user-name'],
        password=request.form['password'],
        email=request.form['email'],
        telefono=request.form['telefono']
    )
    db.session.add(nuevo_registro)
    db.session.commit()
    print("Registro se guardo en la base de datos")
    return redirect('/')





@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        nombre_usuario = request.form['username']
        password = request.form['password']

        usuario = Registro.query.filter_by(user_name=nombre_usuario).first()

        if usuario:
            if usuario and usuario.password == password:
                if usuario and usuario.password == password:
                    session['usuario'] = {
                            'id': usuario.id,
                            'user_name': usuario.user_name,
                            'email': usuario.email,
                            'telefono': usuario.telefono,
                            'es_admi': usuario.es_admi
                        }
                return redirect(url_for('index'))
            else:
                error = 'Usuario y contraseña incorrectos'
                return render_template('login.html', error=error)
        else:
            error = 'Usuario no registrado'
            return render_template('login.html', error=error)
        

    return render_template('login.html')

@app.route('/')
def index():
    eventos = Evento.query.filter_by(activo=True).all()
    return render_template('index.html', eventos=eventos)




@app.route('/actualizar_usuario', methods=['POST', 'GET'])
def actualizar_usuario():
    if 'usuario' not in session:
        flash("Debés iniciar sesión para editar tus datos.")
        return redirect(url_for('login'))

    user_id = session['usuario']['id']
    user = Registro.query.get(user_id)

    if not user:
        
        return redirect(url_for('formulario'))

    if request.method == 'POST':
        nuevo_user_name = request.form.get('user-name')
        nueva_password = request.form.get('password')
        repetir_password = request.form.get('password2')
        nuevo_email = request.form.get('email')
        nuevo_telefono = request.form.get('telefono')

        if nuevo_user_name and nuevo_user_name != user.user_name:
            
            existente = Registro.query.filter_by(user_name=nuevo_user_name).first()
            if existente:
                flash("El nombre de usuario ya está en uso.")
                return redirect(url_for('formulario'))
            else:
                user.user_name = nuevo_user_name
                session['usuario']['user_name'] = nuevo_user_name

        
        if nueva_password:
            if nueva_password != repetir_password:
                flash("Las contraseñas no coinciden.")
                return redirect(url_for('formulario'))
            user.password = nueva_password 
            
        if nuevo_email:
            user.email = nuevo_email
        if nuevo_telefono:
            user.telefono = nuevo_telefono

        db.session.commit()

        session['usuario']['email'] = user.email
        session['usuario']['telefono'] = user.telefono

        flash("Datos actualizados correctamente.")
        return redirect(url_for('formulario'))

    return render_template('formulario.html')




@app.route('/carrito')
def carrito():
        if 'usuario' not in session:
            error = 'Débes iniciar sesión'
            return render_template('login.html', error=error)   
        return render_template('carrito.html')



@app.route('/logout', methods=['POST'])
def logout():
    session.pop('usuario', None)
    return redirect(url_for('index'))


#---------------------ADMI-------------------------
class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(200))
    precio = db.Column(db.Float, nullable=False)
    imagen = db.Column(db.String(200))
    fecha = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)


@app.route('/admin/eventos')
def admin():
    eventos = Evento.query.filter_by(activo=True).all()
    return render_template('admin.html', eventos=eventos)


@app.route('/admin/eventos/nuevo', methods=['GET', 'POST'])
def crear_evento():
    if request.method == 'POST':
        titulo = request.form.get('titulo')
        descripcion = request.form.get('descripcion')
        precio = float(request.form.get('precio'))
        fecha = datetime.strptime(request.form.get('fecha'), '%Y-%m-%dT%H:%M')
        activo = request.form.get('activo') == '1'

          
        file = request.files.get('imagen')
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            ruta_imagen = f'img/{filename}' 
        else:
            ruta_imagen = 'img/default.jpg'  

        nuevo = Evento(titulo=titulo, descripcion=descripcion, precio=precio, imagen=ruta_imagen, fecha=fecha, activo=activo)
        db.session.add(nuevo)
        db.session.commit()
        return redirect(url_for('admin'))
    
    return render_template('crearEventos.html')

#-----------------borrarr evento ----------------

@app.route('/admin/eventos/<int:id>/borrar', methods=['POST'])
def borrar_evento(id):
    evento = Evento.query.get_or_404(id)
    evento.activo = False
    db.session.commit()
    return redirect(url_for('admin'))


#----------------------CONFIGURACION PARA SUBIR ARCHIVOS-----------------

import os
from werkzeug.utils import secure_filename

app.config['UPLOAD_FOLDER'] = os.path.join('static', 'img')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # máximo 16MB (puedes ajustar)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS





if __name__ == '__main__':
    with app.app_context():
        db.create_all()


        if not Registro.query.filter_by(user_name='admin1').first():
            admin1 = Registro(user_name='admin1', password='cristian123', email='admin1@mail.com', telefono='1111', es_admi=True)
            admin2 = Registro(user_name='admin2', password='marco123', email='admin2@mail.com', telefono='2222', es_admi=True)
            db.session.add_all([admin1, admin2])
            db.session.commit()

    app.run(debug=True)







