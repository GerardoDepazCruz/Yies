from flask import Flask, jsonify, request, render_template, redirect, url_for
from flask_mail import Mail, Message
from models.usuario import Usuario
from models.plan import Plan
from models.suscripcion import Suscripcion
from models.perfil import Perfil
from models.pago import Pago
from datetime import datetime, timedelta
from models.historial import Historial
import random
import string

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'creugeni12@gmail.com'     # tu correo
app.config['MAIL_PASSWORD'] = 'ciddlaryffulfbko'         # tu contraseña app

mail = Mail(app)

usuario_model = Usuario()
plan_model = Plan()
suscripcion_model = Suscripcion()
perfil_model = Perfil()
pago_model = Pago()
historial_model = Historial()


def generar_pin():
    return ''.join(random.choices(string.digits, k=5))

def generar_contrasena():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        correo = request.form.get('correo')
        contrasena = request.form.get('contrasena')
        usuarios = usuario_model.obtener_todos()
        usuario = next((u for u in usuarios if u['correo'] == correo and u['contrasena'] == contrasena), None)
        if usuario:
            usuario_id = usuario['id']
            return redirect(url_for('mostrar_perfiles', usuario_id=usuario_id))
        else:
            return "Credenciales incorrectas", 401
    return render_template('login.html')

# Formulario inicial para correo y plan (GET) y redirigir a pago (POST)
@app.route('/suscripcion', methods=['GET', 'POST'])
def suscripcion():
    if request.method == 'POST':
        correo = request.form.get('correo')
        plan = request.form.get('plan')
        return redirect(url_for('formulario_pago', correo=correo, plan=plan))
    return render_template('formulario_suscripcion_inicial.html')

# Mostrar formulario para método pago
@app.route('/formulario_pago')
def formulario_pago():
    correo = request.args.get('correo')
    plan = request.args.get('plan')
    return render_template('formulario_pago.html', correo=correo, plan=plan)

# Procesar pago, crear usuario, suscripción, perfiles, y enviar correo
@app.route('/procesar_pago', methods=['POST'])
def procesar_pago():
    correo = request.form.get('correo')
    plan_nombre = request.form.get('plan')
    metodo_pago = request.form.get('metodo_pago')

    contraseña = generar_contrasena()
    nombre_usuario = correo.split('@')[0]
    perfil = 'usuario'
    fecha_inicio = datetime.today().date()
    fecha_fin = fecha_inicio + timedelta(days=30)

    usuario_model.crear(nombre_usuario, correo, contraseña, perfil, fecha_fin)
    usuarios = usuario_model.obtener_todos()
    usuario_id = next((u['id'] for u in usuarios if u['correo'] == correo), None)

    planes = plan_model.obtener_todos()
    plan_info = next((p for p in planes if p['nombre'].lower() == plan_nombre.lower()), None)
    plan_id = plan_info['id']

    suscripcion_id = suscripcion_model.crear(usuario_id, plan_id, fecha_inicio, fecha_fin, True)

    monto = plan_info['precio']
    pago_model.crear(user_id=usuario_id, suscripcion_id=suscripcion_id, monto=monto, fecha_pago=fecha_inicio, metodo_pago=metodo_pago)

    cantidad_perfiles = 2 if plan_nombre.lower() == 'basico' else 5
    perfiles_creados = []
    for i in range(1, cantidad_perfiles + 1):
        pin = generar_pin()
        nombre_perfil = f"Perfil {i}"
        perfil_model.crear_perfil(usuario_id, nombre_perfil, pin)
        perfiles_creados.append((nombre_perfil, pin))

    cuerpo_email = f"Hola,\n\nTu cuenta Yies ha sido creada con plan {plan_nombre}.\n\nCorreo: {correo}\nContraseña: {contraseña}\nMétodo de pago: {metodo_pago}\n\nPerfiles y PINs:\n"
    for np, p in perfiles_creados:
        cuerpo_email += f"{np}: PIN {p}\n"

    msg = Message("Bienvenido a Yies Streaming", sender=app.config['MAIL_USERNAME'], recipients=[correo])
    msg.body = cuerpo_email
    mail.send(msg)

    return render_template('pago_exitoso.html', metodo_pago=metodo_pago, correo=correo)



@app.route('/perfiles/<int:usuario_id>')
def mostrar_perfiles(usuario_id):
    perfiles = perfil_model.obtener_perfiles(usuario_id)
    return render_template('perfiles.html', perfiles=perfiles)

@app.route('/valida_pin/<int:perfil_id>', methods=['GET', 'POST'])
def valida_pin(perfil_id):
    if request.method == 'POST':
        pin = request.form.get('pin')
        if perfil_model.validar_pin(perfil_id, pin):
            return redirect(url_for('catalogo'))
        else:
            return "PIN incorrecto", 401
    return render_template('valida_pin.html', perfil_id=perfil_id)

@app.route('/catalogo')
def catalogo():
    return render_template('catalogo.html')

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/visualizacion', methods=['POST'])
def registrar_visualizacion():
    usuario_id = request.form.get('usuario_id') or request.json.get('usuario_id')
    contenido_id = request.form.get('contenido_id') or request.json.get('contenido_id')
    if not usuario_id or not contenido_id:
        return jsonify({'error': 'Faltan datos'}), 400
    try:
        historial_model.registrar_visualizacion(int(usuario_id), int(contenido_id))
        return jsonify({'ok': True}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/historial/<int:usuario_id>', methods=['GET'])
def obtener_historial(usuario_id):
    try:
        resultados = historial_model.obtener_historial(usuario_id)
        return jsonify({'historial': resultados}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/valoracion', methods=['POST'])
def crear_valoracion():
    data = request.form if request.form else request.get_json()
    usuario_id = data.get('usuario_id')
    contenido_id = data.get('contenido_id')
    calificacion = data.get('calificacion')
    comentario = data.get('comentario')
    if not usuario_id or not contenido_id or not calificacion:
        return jsonify({'error': 'Faltan datos'}), 400
    try:
        historial_model.crear_o_actualizar_valoracion(int(usuario_id), int(contenido_id), int(calificacion), comentario)
        return jsonify({'ok': True}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/valoracion', methods=['PUT'])
def actualizar_valoracion():
    data = request.get_json()
    usuario_id = data.get('usuario_id')
    contenido_id = data.get('contenido_id')
    calificacion = data.get('calificacion')
    comentario = data.get('comentario')
    if not usuario_id or not contenido_id or not calificacion:
        return jsonify({'error': 'Faltan datos'}), 400
    try:
        historial_model.crear_o_actualizar_valoracion(int(usuario_id), int(contenido_id), int(calificacion), comentario)
        return jsonify({'ok': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/valoracion', methods=['DELETE'])
def eliminar_valoracion():
    data = request.args if request.args else request.get_json()
    usuario_id = data.get('usuario_id')
    contenido_id = data.get('contenido_id')
    if not usuario_id or not contenido_id:
        return jsonify({'error': 'Faltan datos'}), 400
    try:
        ok = historial_model.borrar_valoracion(int(usuario_id), int(contenido_id))
        if ok:
            return jsonify({'ok': True}), 200
        else:
            return jsonify({'error': 'No encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/valoraciones/contenido/<int:contenido_id>', methods=['GET'])
def valoraciones_contenido(contenido_id):
    try:
        datos = historial_model.obtener_valoraciones_contenido(contenido_id)
        return jsonify(datos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


