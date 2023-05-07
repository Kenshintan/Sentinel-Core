import os
import sqlite3
from flask import Flask, redirect, render_template, request, jsonify
import pandas as pd
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'Tempfiles'

app = Flask(__name__)
app.debug = True 

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def connection():
    conn = sqlite3.connect("Sentineldb.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def main():
    conn = connection()
    conn.execute("DELETE FROM tempdb")
    conn.execute("INSERT INTO tempdb SELECT * FROM dataentries")
    data = conn.execute("SELECT * FROM tempdb")
    conn.commit()
    return render_template("index.html", data = data)

@app.route("/addentry", methods=["POST"])
def addentry():
    conn = connection()
    locations = request.form.get("locations")
    dates = request.form.get("dates")
    times = request.form.get("times")
    sittypes = request.form.get("sittypes")
    addresses = request.form.get("addresses")
    zones = request.form.get("zones")
    incidentnumbers = request.form.get("incidentnumbers")
    brieffacts = request.form.get("brieffacts")

    conn.execute("INSERT INTO 'dataentries' (locations,addresses,zones,dates,times,sittypes,incidentnumbers,brieffacts) VALUES(?,?,?,?,?,?,?,?)", (locations,addresses,zones,dates,times,sittypes,incidentnumbers,brieffacts,))
    conn.commit()
    conn.close()
    return redirect("/")

@app.route("/marker", methods=["GET"])
def markerdata():
    conn = sqlite3.connect("Sentineldb.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id,locations FROM tempdb")
    markerdata = cursor.fetchall()
    return jsonify(markerdata)

@app.route("/entrydetails", methods=["POST"])
def entrydetails():
    conn = sqlite3.connect("Sentineldb.db")
    cursor = conn.cursor()
    entryid = int(request.get_data())
    print(entryid)
    cursor.execute("SELECT * FROM dataentries WHERE id = ?", (entryid,))
    dataset = cursor.fetchall()
    return jsonify(dataset)

@app.route("/deleteentry", methods=["POST"])
def deleteentry():
    conn = connection()
    entryid = int(request.get_data())
    conn.execute("DELETE FROM dataentries WHERE id = ?", (entryid,))
    conn.commit()
    conn.close()
    return redirect("/")

@app.route("/filter", methods=["POST"])
def filterdata():
    conn = connection()
    dstart = request.form.get("filterdatestart")
    dend = request.form.get("filterdateend")
    tstart = request.form.get("filtertimestart")
    tend = request.form.get("filtertimeend")
    sit = request.form.getlist("filtersittype")
    conn.execute("DELETE FROM tempdb")
    conn.execute("INSERT INTO tempdb SELECT * FROM dataentries")
    data = conn.execute("SELECT * FROM tempdb")
    if sit:
        placeholder = '?'
        placeholders = ','.join(placeholder*len(sit))
        query = "DELETE FROM tempdb WHERE id NOT IN (SELECT id FROM tempdb WHERE sittypes IN (%s))" %placeholders
        conn.execute(query,sit)
        data = conn.execute("SELECT * FROM tempdb")
    elif dstart and dend:
        conn.execute("DELETE FROM tempdb WHERE id NOT IN (SELECT id FROM tempdb WHERE dates BETWEEN ? AND ?)",(dstart,dend,))
        data = conn.execute("SELECT * FROM tempdb")
    elif tstart and tend:
        conn.execute("DELETE FROM tempdb WHERE id NOT IN (SELECT id FROM tempdb WHERE times BETWEEN ? AND ?)",(tstart,tend,))
        data = conn.execute("SELECT * FROM tempdb")
    conn.commit()
    return render_template("index.html", data = data)

@app.route("/cleardb", methods=["GET"])
def cleardb():
    conn = connection()
    conn.execute("DELETE FROM tempdb")
    conn.execute("DELETE FROM dataentries")
    conn.commit()
    return redirect("/")

@app.route("/sendfile", methods=["POST"])
def sendfile():
    conn = connection()
    filedata = request.files.get("fileinsert")
    filename = secure_filename(filedata.filename)
    filedata.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
    filepath = os.path.join(app.config['UPLOAD_FOLDER'],filename)
    uploadset = pd.read_csv(filepath, encoding='unicode_escape')
    uploadset.to_sql("dataentries",conn,if_exists="append",index=False)
    conn.commit()
    return redirect("/")