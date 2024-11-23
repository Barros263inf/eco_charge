#!/usr/bin/env python
# coding: utf-8
from flask import Flask, jsonify, request
from flask_cors import CORS
import oracledb
import json

app = Flask(__name__)
CORS(app)  # Permite requisições de origens diferentes

# Função para conectar ao banco de dados Oracle
def get_db_connection():
    DATA_FILE = "oracle_conn.json"
    with open(DATA_FILE, 'r') as file:
        xfile = json.load(file)

    connection = oracledb.connect(
        user=xfile[0]["user"],
        password=xfile[0]["password"],
        dsn=xfile[0]["dsn"]
    )
    return connection

### AUTENICAÇÃO
@app.route('/auth', methods=['POST'])
def authenticate():
    # Recebe o JSON com email e senha
    credentials = request.json
    email = credentials.get("email")
    senha = credentials.get("senha")

    if not email or not senha:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Consulta para verificar as credenciais
        query = "SELECT gs_clie_nm FROM gs_cliente WHERE gs_clie_email = :email AND gs_clie_pw = :senha"
        cursor.execute(query, {"email": email, "senha": senha})
        row = cursor.fetchone()

        if row:
            nome_usuario = row[0]  # Nome do cliente encontrado
            return jsonify({"message": "Autenticação bem-sucedida", "nome": nome_usuario}), 200
        else:
            return jsonify({"message": "Email ou senha incorretos"}), 401
    except Exception as e:
        return jsonify({"message": f"Erro durante autenticação: {str(e)}"}), 500
    finally:
        cursor.close()
        connection.close()

### CLIENTE
# Rota para retornar todos os clientes (GET)
@app.route('/clientes', methods=['GET'])
def get_clientes():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_cliente"
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    clientes = [
        {
            "id": row[0],
            "email": row[1],
            "nome": row[2],
            "sobrenome": row[3],
            "senha": row[4],
        }
        for row in rows
    ]
    return jsonify(clientes)

# Rota para retornar um cliente pelo ID (GET)
@app.route('/cliente/<int:id>', methods=['GET'])
def get_cliente_by_id(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_cliente WHERE gs_clie_id = :id"
    cursor.execute(query, {"id": id})
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        cliente = {
            "id": row[0],
            "email": row[1],
            "nome": row[2],
            "sobrenome": row[3],
            "senha": row[4],
        }
        return jsonify(cliente), 200
    else:
        return jsonify({"message": "Cliente não encontrado"}), 404

# Rota para retornar um cliente pelo email (GET)
@app.route('/cliente/<string:email>', methods=['GET'])
def get_cliente_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = """SELECT gs_clie_id, gs_clie_email, gs_clie_nm, gs_clie_sb 
            FROM gs_cliente
            WHERE gs_clie_email = :email"""
    cursor.execute(query, {"email": email})
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        cliente = {
            "id": row[0],
            "email": row[1],
            "nome": row[2],
            "sobrenome": row[3]
        }
        return jsonify(cliente), 200
    else:
        return jsonify({"message": "Cliente não encontrado"}), 404

# Rota para adicionar um novo cliente (POST)
@app.route('/cliente', methods=['POST'])
def add_cliente():
    novo_cliente = request.json
    email = novo_cliente.get("email")
    nome = novo_cliente.get("nome")
    sobrenome = novo_cliente.get("sobrenome")
    senha = novo_cliente.get("senha")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO gs_cliente (gs_clie_email, gs_clie_nm, gs_clie_sb, gs_clie_pw)
            VALUES (:email, :nome, :sobrenome, :senha)
        """, {"email": email, "nome": nome, "sobrenome": sobrenome, "senha": senha})

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Cliente adicionado com sucesso"}), 201
    except Exception as e:
        connection.rollback()  # Reverte a transação em caso de erro
        cursor.close()
        connection.close()
        return jsonify({"message": f"Erro ao adicionar cliente: {str(e)}"}), 500

# Rota para atualizar um cliente existente pelo ID (PUT)
@app.route('/cliente/<int:id>', methods=['PUT'])
def update_cliente(id):
    cliente_atualizado = request.json
    email = cliente_atualizado.get("email")
    nome = cliente_atualizado.get("nome")
    sobrenome = cliente_atualizado.get("sobrenome")
    senha = cliente_atualizado.get("senha")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE gs_cliente
        SET gs_clie_email = :email, gs_clie_nm = :nome, gs_clie_sb = :sobrenome, gs_clie_pw = :senha
        WHERE gs_clie_id = :id
    """, {"email": email, "nome": nome, "sobrenome": sobrenome, "senha": senha, "id": id})

    connection.commit()
    rows_updated = cursor.rowcount # Verifica quantas linhas foram atualizadas
    cursor.close()
    connection.close()

    if rows_updated > 0:
        return jsonify({"message": "Cliente atualizado com sucesso"}), 200
    else:
        return jsonify({"message": "Nenhum cliente encontrado para atualizar"}), 404

# Rota para remover um cliente pelo ID (DELETE)
@app.route('/cliente/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM gs_cliente WHERE gs_clie_id = :id", {"id": id})

    connection.commit()
    rows_deleted = cursor.rowcount  # Verifica quantas linhas foram afetadas
    cursor.close()
    connection.close()

    if rows_deleted > 0:
        return jsonify({"message": "Cliente removido com sucesso"}), 200
    else:
        return jsonify({"message": "Nenhum cliente encontrado para remover"}), 404

### DISPOSITIVO
# Rota para retornar todos os dispositivos (GET)
@app.route('/dispositivos', methods=['GET'])
def get_dispositivos():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_dispositivo"
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    dispositivos = [
        {
            "id": row[0],
            "imei": row[1],
            "nome": row[2],
            "modelo": row[3],
            "fabricante": row[4],
            "cliente_email": row[5]
        }
        for row in rows
    ]
    return jsonify(dispositivos)

# Rota para retornar um dispositivo pelo ID (GET)
@app.route('/dispositivo/<int:id>', methods=['GET'])
def get_dispositivo_by_id(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_dispositivo WHERE gs_disp_id = :id"
    cursor.execute(query, {"id": id})
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        dispositivo = {
            "id": row[0],
            "imei": row[1],
            "nome": row[2],
            "modelo": row[3],
            "fabricante": row[4],
            "cliente_email": row[5]
        }
        return jsonify(dispositivo), 200
    else:
        return jsonify({"message": "Dispositivo não encontrado"}), 404

# Rota para retornar um dispositivo pelo Email (GET)
@app.route('/dispositivo/<string:email>', methods=['GET'])
def get_dispositivo_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_dispositivo WHERE gs_disp_clie = :email"
    cursor.execute(query, {"email": email})
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        dispositivo = {
            "id": row[0],
            "imei": row[1],
            "nome": row[2],
            "modelo": row[3],
            "fabricante": row[4],
            "cliente_email": row[5]
        }
        return jsonify(dispositivo), 200
    else:
        return jsonify({"message": "Dispositivo não encontrado"}), 404

# Rota para adicionar um novo dispositivo (POST)
@app.route('/dispositivo', methods=['POST'])
def add_dispositivo():
    novo_dispositivo = request.json
    imei = novo_dispositivo.get("imei")
    nome = novo_dispositivo.get("nome")
    modelo = novo_dispositivo.get("modelo")
    fabricante = novo_dispositivo.get("fabricante")
    cliente_email = novo_dispositivo.get("cliente_email")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO gs_dispositivo (gs_disp_im, gs_disp_nm, gs_disp_md, gs_disp_fb, gs_disp_clie)
            VALUES (:imei, :nome, :modelo, :fabricante, :cliente_email)
        """, {"imei": imei, "nome": nome, "modelo": modelo, "fabricante": fabricante, "cliente_email": cliente_email})

        connection.commit()
        novo_id = cursor.lastrowid  # Obtém o ID gerado, se suportado
        cursor.close()
        connection.close()

        return jsonify({"message": "Dispositivo adicionado com sucesso", "id": novo_id}), 201
    except Exception as e:
        connection.rollback()  # Reverte a transação em caso de erro
        cursor.close()
        connection.close()
        return jsonify({"message": f"Erro ao adicionar dispositivo: {str(e)}"}), 500

# Rota para atualizar um dispositivo existente pelo ID (PUT)
@app.route('/dispositivo/<int:id>', methods=['PUT'])
def update_dispositivo(id):
    dispositivo_atualizado = request.json
    imei = dispositivo_atualizado.get("imei")
    nome = dispositivo_atualizado.get("nome")
    modelo = dispositivo_atualizado.get("modelo")
    fabricante = dispositivo_atualizado.get("fabricante")
    cliente_email = dispositivo_atualizado.get("cliente_email")

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE gs_dispositivo
        SET gs_disp_im = :imei, 
            gs_disp_nm = :nome, 
            gs_disp_md = :modelo, 
            gs_disp_fb = :fabricante, 
            gs_disp_clie = :cliente_email
        WHERE gs_disp_id = :id
    """, {"imei": imei, "nome": nome, "modelo": modelo, "fabricante": fabricante, "cliente_email": cliente_email, "id": id})

    connection.commit()
    rows_updated = cursor.rowcount  # Verifica quantas linhas foram afetadas
    cursor.close()
    connection.close()

    if rows_updated > 0:
        return jsonify({"message": "Dispositivo atualizado com sucesso"}), 200
    else:
        return jsonify({"message": "Nenhum dispositivo encontrado para atualizar"}), 404

# Rota para remove um dispositivo pelo ID (DELETE)
@app.route('/dispositivo/<int:id>', methods=['DELETE'])
def delete_dispositivo(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM gs_dispositivo WHERE gs_disp_id = :id", {"id": id})

    connection.commit()
    rows_deleted = cursor.rowcount  # Verifica quantas linhas foram afetadas
    cursor.close()
    connection.close()

    if rows_deleted > 0:
        return jsonify({"message": "Dispositivo removido com sucesso"}), 200
    else:
        return jsonify({"message": "Nenhum dispositivo encontrado para remover"}), 404

### ESTABELECIMENTO
# Rota para retornar todos os estabelecimentos (GET)
@app.route('/estabelecimentos', methods=['GET'])
def get_estabelecimentos():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_estabelecimento"
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    estabelecimentos = [
        {
            "id": row[0],
            "cnpj": row[1],
            "nome": row[2],
            "longitude": row[3],
            "latitude": row[4],
            "cep": row[5],
            "logradouro": row[6],
            "numero": row[7],
            "bairro": row[8],
            "complemento": row[9],
            "cidade": row[10],
            "uf": row[11],
        }
        for row in rows
    ]
    return jsonify(estabelecimentos)

# Rota para retornar um único estabelecimento pelo ID (GET)
@app.route('/estabelecimento/<int:id>', methods=['GET'])
def get_estabelecimento_by_id(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Consulta SQL para buscar um estabelecimento pelo ID
    query = "SELECT * FROM gs_estabelecimento WHERE gs_estab_id = :id"
    cursor.execute(query, {"id": id})
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        estabelecimento = {
            "id": row[0],
            "cnpj": row[1],
            "nome": row[2],
            "longitude": row[3],
            "latitude": row[4],
            "cep": row[5],
            "logradouro": row[6],
            "numero": row[7],
            "bairro": row[8],
            "complemento": row[9],
            "cidade": row[10],
            "uf": row[11],
        }
        return jsonify(estabelecimento), 200
    else:
        return jsonify({"message": "Estabelecimento não encontrado"}), 404

# Rota para adicionar um novo estabelecimento (POST)
@app.route('/estabelecimento', methods=['POST'])
def add_estabelecimento():
    novo_estabelecimento = request.json
    cnpj = novo_estabelecimento.get("cnpj")
    nome = novo_estabelecimento.get("nome")
    logradouro = novo_estabelecimento.get("logradouro")
    latitude = novo_estabelecimento.get("latitude")
    longitude = novo_estabelecimento.get("longitude")
    cep = novo_estabelecimento.get("cep")
    numero = novo_estabelecimento.get("numero")
    bairro = novo_estabelecimento.get("bairro")
    complemento = novo_estabelecimento.get("complemento")
    cidade = novo_estabelecimento.get("cidade")
    uf = novo_estabelecimento.get("uf")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO gs_estabelecimento (
            gs_estab_cnpj, 
            gs_estab_nom, 
            gs_estab_lgt, 
            gs_estab_lat, 
            gs_estab_cep, 
            gs_estab_log, 
            gs_estab_num, 
            gs_estab_brr, 
            gs_estab_cmp, 
            gs_estab_cid, 
            gs_estab_uf)
            VALUES (
            :cnpj, 
            :nome, 
            :longitude,
            :latitude, 
            :cep, 
            :logradouro, 
            :numero, 
            :bairro, 
            :complemento, 
            :cidade, 
            :uf)
        """, {
            "cnpj": cnpj,
            "nome": nome,
            "logradouro": logradouro,
            "latitude": latitude,
            "longitude": longitude,
            "cep": cep,
            "numero": numero,
            "bairro": bairro,
            "complemento": complemento,
            "cidade": cidade,
            "uf": uf
        })

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Estabelecimento adicionado com sucesso"}), 201
    except Exception as e:
        connection.rollback()  # Reverte a transação em caso de erro
        cursor.close()
        connection.close()
        return jsonify({"message": f"Erro ao adicionar estabelecimento: {str(e)}"}), 500

# Rota para atualizar um estabelecimento existente (PUT)
@app.route('/estabelecimento/<int:id>', methods=['PUT'])
def update_estabelecimento(id):
    estab_atualizado = request.json

    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE gs_estabelecimento
        SET gs_estab_cnpj = :cnpj, gs_estab_nom = :nome, gs_estab_lgt = :longitude, gs_estab_lat = :latitude,
            gs_estab_cep = :cep, gs_estab_log = :logradouro, gs_estab_num = :numero,
            gs_estab_brr = :bairro, gs_estab_cmp = :complemento, gs_estab_cid = :cidade, gs_estab_uf = :uf
        WHERE gs_estab_id = :id
    """, {**estab_atualizado, "id": id})

    connection.commit()
    rows_updated = cursor.rowcount # Verifica quantas linhas foram afetadas
    cursor.close()
    connection.close()

    if rows_updated > 0:
        return jsonify({"message": "Estabelecimento atualizado com sucesso"}), 200
    else:
        return jsonify({"message": "Nenhum estabelecimento encontrado para atualizar"}), 404

# Rota para deletar um estabelecimento (DELETE)
@app.route('/estabelecimento/<int:id>', methods=['DELETE'])
def delete_estabelecimento(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM gs_estabelecimento WHERE gs_estab_id = :id", {"id": id})

    connection.commit()
    rows_deleted = cursor.rowcount # Verifica quantas linhas foram afetadas
    cursor.close()
    connection.close()

    if rows_deleted > 0:
        return jsonify({"message": "Estabelecimento removido com sucesso"}), 200
    else:
        return jsonify({"message": "Nenhum dispositivo encontrado para remover"}), 404

# Rota para retornar todas as sessões (GET)
@app.route('/sessoes', methods=['GET'])
def get_sessoes():
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_sessao"
    cursor.execute(query)
    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    sessoes = [
        {
            "id": row[0],
            "dispositivo": row[1],
            "cliente": row[2],
            "data": row[3].strftime("%Y-%m-%d") if row[3] else None
        }
        for row in rows
    ]
    return jsonify(sessoes)

# Rota para retornar uma sessão pelo ID (GET)
@app.route('/sessao/<int:id>', methods=['GET'])
def get_sessao_by_id(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    query = "SELECT * FROM gs_sessao WHERE gs_sessao_id = :id"
    cursor.execute(query, {"id": id})
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    if row:
        sessao = {
            "id": row[0],
            "dispositivo": row[1],
            "cliente": row[2],
            "data": row[3].strftime("%Y-%m-%d") if row[3] else None
        }
        return jsonify(sessao), 200
    else:
        return jsonify({"message": "Sessão não encontrada"}), 404

# Rota para adicionar uma nova sessão (POST)
@app.route('/sessao', methods=['POST'])
def add_sessao():
    nova_sessao = request.json
    dispositivo = nova_sessao.get("dispositivo")
    cliente = nova_sessao.get("cliente")
    data = nova_sessao.get("data")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO gs_sessao (gs_sessao_disp, gs_sessao_clie, gs_sessao_dt)
            VALUES (:dispositivo, :cliente, TO_DATE(:data, 'YYYY-MM-DD'))
        """, {"dispositivo": dispositivo, "cliente": cliente, "data": data})

        connection.commit()
        novo_id = cursor.lastrowid  # Obtém o ID gerado, se suportado
        cursor.close()
        connection.close()

        return jsonify({"message": "Sessão adicionada com sucesso", "id": novo_id}), 201
    except Exception as e:
        connection.rollback()  # Reverte a transação em caso de erro
        cursor.close()
        connection.close()
        return jsonify({"message": f"Erro ao adicionar sessão: {str(e)}"}), 500

# Rota para atualizar uma sessão existente pelo ID (PUT)
@app.route('/sessao/<int:id>', methods=['PUT'])
def update_sessao(id):
    sessao_atualizada = request.json
    dispositivo = sessao_atualizada.get("dispositivo")
    cliente = sessao_atualizada.get("cliente")
    data = sessao_atualizada.get("data")

    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            UPDATE gs_sessao
            SET gs_sessao_disp = :dispositivo, 
                gs_sessao_clie = :cliente, 
                gs_sessao_dt = TO_DATE(:data, 'YYYY-MM-DD')
            WHERE gs_sessao_id = :id
        """, {"dispositivo": dispositivo, "cliente": cliente, "data": data, "id": id})

        connection.commit()
        rows_updated = cursor.rowcount  # Verifica quantas linhas foram afetadas
        cursor.close()
        connection.close()

        if rows_updated > 0:
            return jsonify({"message": "Sessão atualizada com sucesso"}), 200
        else:
            return jsonify({"message": "Nenhuma sessão encontrada para atualizar"}), 404
    except Exception as e:
        connection.rollback()  # Reverte a transação em caso de erro
        cursor.close()
        connection.close()
        return jsonify({"message": f"Erro ao atualizar sessão: {str(e)}"}), 500

# Rota para remover uma sessão pelo ID (DELETE)
@app.route('/sessao/<int:id>', methods=['DELETE'])
def delete_sessao(id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM gs_sessao WHERE gs_sessao_id = :id", {"id": id})

    connection.commit()
    rows_deleted = cursor.rowcount  # Verifica quantas linhas foram afetadas
    cursor.close()
    connection.close()

    if rows_deleted > 0:
        return jsonify({"message": "Sessão removida com sucesso"}), 200
    else:
        return jsonify({"message": "Nenhuma sessão encontrada para remover"}), 404

if __name__ == '__main__':
    app.run(debug=False)
