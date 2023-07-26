const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 3006;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const connection = mysql.createConnection({
  host: "kay-fish.clfaq7tsjsnd.us-east-1.rds.amazonaws.com",
  user: "samisa",
  password: "samisa123",
  database: "kaychiapas",
  port:'3306'
});
connection.connect(function (err,res) {
  if (err) {
    console.log(err.fatal);
    console.log(err.code);
    return;
  } else {
    console.log("conexion Exitosa");
  }
});
app.get("/",(req, res) => {
  res.json("Puto nahum si abres el link")
})
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}.`);
});
app.get("/usuarios/:correo&:password", (req, res) => {
  const correo = req.params.correo;
  const password = req.params.password;
  connection.query(
    "select * from usuarios where Usuario = ? && Contraseña = ?;",
    [correo, password],
    (error, resultado) => {
      if (error) {
        res.status(500).send(error + " Usuario no encontrado");
      } else {
        res.status(200).send(resultado);
      }
      
    }
  );

});
app.get("/sales", (req, res) => {
  connection.query("select * from ventas;", (error, resultado) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(resultado);
    }
  });
});


app.get("/sales2", (req, res) => {
  const currentDate = new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato 'YYYY-MM-DD'

  connection.query(
    "SELECT * FROM ventas WHERE DATE(FechaVenta) = CURDATE();",
    (error, resultado) => {
      if (error) {
        res.status(500).send(error, "errorrrr");
      } else {
        res.status(200).send(resultado);
      }
    }
  );
});

app.get("/sales3", (req, res) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  const sql = `SELECT * FROM ventas WHERE FechaVenta >= ? AND FechaVenta <= ?`;

  connection.query(sql, [startDate, endDate], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: "Error al obtener las ventas" });
    } else {
      res.send(results);
    }
  });
});

app.get("/sales4", (req, res) => {
  const month = req.query.month;

  // Realiza la consulta en la base de datos filtrando por el mes

  // Ejemplo de consulta con filtrado por mes usando MySQL
  const query = `SELECT * FROM ventas WHERE MONTH(FechaVenta) = ?`;

  // Ejecutar la consulta en la base de datos MySQL
  connection.query(query, [month], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: "Error al obtener las ventas" });
    } else {
      res.send(results);
    }
  });
});

app.post("/producto-nuevo", (req, res) => {
  const folio = req.body.folio;
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const cantidad = req.body.cantidad;
  const proveedor = req.body.proveedor;
  const tipo = req.body.tipo;
  const unidadMedida = req.body.unidadMedida;
  const edad = req.body.edad;
  const fecha = req.body.fecha;
  if (tipo != "Tilapias" && tipo != "Mojarras") {
    connection.query(
      "INSERT INTO inventariocosas(ProductoID, Nombre, FechaIngreso,Tipo,PrecioUnitario, Proveedor, Cantidad, UnidadMedida) VALUE(?,?,?,?,?,?,?,?);",
      [folio, nombre, fecha, tipo, precio, proveedor, cantidad, unidadMedida],
      (error, resultado) => {
        //alterar(resultado);
        if (error) {
          console.log(res.status(500).send(error, ));
        } else {
          console.log(res.status(200).send(resultado));
        }
      }
    );
  } else {
    connection.query(
      "INSERT INTO inventarioanimales(ProductoID, Nombre, FechaIngreso,Tipo,PrecioUnitario, Cantidad, Edad) VALUE(?,?,?,?,?,?,?);",
      [folio, nombre, fecha, tipo, precio, cantidad, edad],
      (error, resultado) => {
        //alterar(resultado);
        if (error) {
          console.log(res.status(500).send(error, ));
        } else {
          console.log(res.status(200).send(resultado));
        }
      }
    );
  }
});

app.post("/ventas", (req, res) => {
  const folio = req.body.folio;
  const cantidad = req.body.cantidad;
  const concepto = req.body.concepto;
  const fecha = req.body.fecha;
  const total = req.body.total;
  const vendedor = req.body.vendedor;
  const precioUni = req.body.precioUni;

  connection.query(
    "INSERT INTO ventas(ID_Venta, Cantidad, Concepto, FechaVenta, TotalVenta, Vendedor, PrecioUnitario) VALUE(?,?,?,?,?,?,?);",
    [folio, cantidad, concepto, fecha, total, vendedor, precioUni],
    (error, resultado) => {
      //alterar(resultado);
      if (error) {
        console.log(res.status(500).send(error));
      } else {
        console.log(res.status(200).send(resultado));
      }
    }
  );
});
app.post("/pedidos", (req, res) => {
  const folio = req.body.folio;
  const producto = req.body.producto;
  const cantidad = req.body.cantidad;
  const solicitante = req.body.solicitante;
  const fechaI = req.body.fechaI;
  const comprador = req.body.comprador;
  const fechaF = req.body.fechaF;
  const estatus = req.body.estatus;
  const total = req.body.total;
if(estatus == "Pendiente"){
 connection.query(
   "INSERT INTO pedidos(PedidoID, Producto, CantidadComprar, FechaCreada, Solicitante, Comprador, FechaCompra, Estatus,TotalCompra) VALUE(?,?,?,?,?,?,?,?,?);",
   [
     folio,
     producto,
     cantidad,
     fechaI,
     solicitante,
     comprador,
     fechaF,
     estatus,
     total,
   ],
   (error, resultado) => {
     //alterar(resultado);
     if (error) {
       console.log(res.status(500).send(error));
     } else {
       console.log(res.status(200).send(resultado));
     }
   }
 );
}else{
  
  connection.query(
    "UPDATE pedidos set Producto=?, CantidadComprar=?, FechaCreada=?, Solicitante=?, Comprador=?, FechaCompra=?, Estatus=?,TotalCompra =? where PedidoID = ?;",
    [
      producto,
      cantidad,
      fechaI,
      solicitante,
      comprador,
      fechaF,
      estatus,
      total,
      folio,
    ],
    (error, resultado) => {
      //alterar(resultado);
      if (error) {
        console.log(res.status(500).send(error));
      } else {
        console.log(res.status(200).send(resultado));
      }
    }
  );
}
});
app.post("/respaldo", (req, res) => {
  const folio = req.body.folio;
  const cantidad = req.body.cantidad;
  const concepto = req.body.concepto;
  const fechaV = req.body.fechaV;
  const fechaE = req.body.fechaE;
  const total = req.body.total;
  const vendedor = req.body.vendedor;
  const precioUni = req.body.precioUni;
  connection.query(
    "INSERT INTO respaldo_ventas(ID_Venta,Vendedor, Concepto, Cantidad, FechaVenta,FechaEliminada, PrecioUnitario,TotalVenta) VALUE(?,?,?,?,?,?,?,?);",
    [folio, vendedor, concepto, cantidad, fechaV, fechaE, precioUni, total],
    (error, resultado) => {
      //alterar(resultado);
      if (error) {
        console.log(res.status(500).send(error));
      } else {
        console.log(res.status(200).send(resultado));
      }
    }
  );
});


app.get("/busqueda/:option&:cantidad&:cantidadmin", (req, res) => {
  const option = req.params.option;
  const cantidad = req.params.cantidad;
  const cantidadmin = req.params.cantidadmin;
  let query, parametros;
  if (cantidad != 0 && cantidadmin != 0) {
    parametros = [option, cantidad, cantidadmin];
    if (option === "Tilapias" || option === "Mojarras") {
      query =
        "select * from inventarioanimales where Tipo = ? && Cantidad >= ? && Cantidad<=? ORDER BY Cantidad ASC;";
    } else {
      query =
        "select * from inventariocosas where Tipo = ? && Cantidad >= ? && Cantidad<=? ORDER BY Cantidad ASC;";
    }
  } else {
    parametros = [option];
    if (option == "Tilapias" || option == "Mojarras") {
      query =
        "select * from inventarioanimales where Tipo = ? ORDER BY Cantidad ASC;";
    } else {
      query =
        "select * from inventariocosas where Tipo = ?  ORDER BY Cantidad ASC;";
    }
  }
  connection.query(query, parametros, (error, resultado) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(resultado);
    }
  });
});
app.get("/selector/:tipo", (req, res) => {
  const tipo = req.params.tipo;
  let query = "";
  if (tipo === "Mojarras" || tipo === "Tilapias") {
    query =
      "select Nombre, Cantidad, PrecioUnitario from kaychiapas.inventarioanimales where Tipo = ?;";
  } else {
    query =
      "select Nombre, Cantidad, PrecioUnitario,ProductoID from kaychiapas.inventariocosas where Tipo = ?;";
  }
  connection.query(query, [tipo], (error, resultado) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(resultado);
    }
  });
});
app.get("/pendientes/:estatus", (req, resu) => {
  const estatus = req.params.estatus;
  connection.query("select * from pedidos where Estatus=?;",[estatus], (error, resultado) => {
    if (error) {
      resu.status(500).send(error);
    } else {
      resu.status(200).send(resultado);
    }
  });
});
app.get("/sales", (req, res) => {
  connection.query("select * from kaychiapas.ventas;", (error, resultado) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(resultado);
    }
  });
});
app.get("/inventario-animales", (req, res) => {
  connection.query(
    "select * from kaychiapas.inventarioanimales ORDER BY Cantidad ASC;",
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(resultado);
      }
    }
  );
});
app.get("/inventario-cosas", (req, res) => {
  connection.query(
    "select * from kaychiapas.inventariocosas ORDER BY Cantidad ASC;",
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(resultado);
      }
    }
  );
});
app.get("/ID", (req, res) => {
  connection.query(
    "select ID_Venta from kaychiapas.ventas;",
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(resultado);
      }
    }
  );
});
app.get("/fecha-venta", (req, res) => {
  connection.query(
    "SELECT DISTINCT  FechaVenta FROM ventas ORDER BY FechaVenta DESC; ",
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(resultado);
      }
    }
  );
});

app.get("/cantidad-venta",(req, res)=>{
  connection.query(
    "SELECT TotalVenta FROM ventas ORDER BY TotalVenta DESC; ",
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
          res.status(200).send(resultado);
        
      }
    }
  );
})
app.get("/fechas/:min&:max", (req, res) => {
  const min = req.params.min;
  const max = req.params.max;
  connection.query(
    "SELECT TotalVenta, FechaVenta FROM ventas WHERE FechaVenta BETWEEN ? AND ?; ",
    [min, max],
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(resultado);
      }
    }
  );
});
app.get("/pedidos", (req, res) => {
  connection.query("SELECT * FROM pedidos", (error, results) => {
    if (error) {
      console.error("Error al obtener los pedidos:", error);
    } else {
      res.status(200).json(results);
    }
  });
  
});
app.get("/count/:nombre&:tipo", (req, res) => {
  const nombre = req.params.nombre;
  const tipo = req.params.tipo;
  var query;
  if (tipo == "Tilapias" || tipo == "Mojarras") {
    query =
      "SELECT COUNT(*) as c FROM kaychiapas.inventarioanimales WHERE Nombre = ?;";
  } else {
    query =
      "SELECT COUNT(*) as c FROM kaychiapas.inventariocosas WHERE Nombre = ?;";
  }
  connection.query(query, [nombre], (error, resultado) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(resultado);
    }
  });
  console.log(nombre, tipo);
});

app.put("/alter", (req, res) => {
  const folio = req.body.folio;
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const cantidad = req.body.cantidad;
  const proveedor = req.body.proveedor;
  const edad = req.body.edad;
  const tipo = req.body.tipo;
  let query, valores;
  if (tipo !== "Tilapias" && tipo !== "Mojarras") {
    query =
      "UPDATE inventariocosas SET Nombre=?, PrecioUnitario=?, Proveedor=?, Cantidad=? WHERE ProductoID = ?;";
    valores = [nombre, precio, proveedor, cantidad, folio];
  } else {
    valores = [nombre, precio, cantidad, edad, folio];
    query =
      "UPDATE inventarioanimales SET Nombre=?, PrecioUnitario=?, Cantidad=?, Edad=? WHERE ProductoID = ?;";
  }
  connection.query(query, valores, (error, resultado) => {
    if (error) {
      console.log(res.status(500).send(error));
    } else {
      console.log(
        res.status(200).send("Datos modificados de la tabla inventario")
      );
    }
  });
});
app.put("/alterar-cantidad", (req, res) => {
  const nombre = req.body.nombre;
  const cantidad = req.body.cantidad;
  const tipo = req.body.tipo;
  let query, valores;
  if (tipo !== "Tilapias" && tipo !== "Mojarras") {
    query = "UPDATE inventariocosas SET Cantidad=? WHERE Nombre = ?;";
    valores = [cantidad, nombre];
  } else {
    valores = [cantidad, nombre];
    query = "UPDATE inventarioanimales SET Cantidad=? WHERE  Nombre = ?;";
  }
  connection.query(query, valores, (error, resultado) => {
    if (error) {
      console.log(res.status(500).send(error));
    } else {
      console.log(
        res.status(200).send("Datos modificados de la tabla inventario")
      );
      console.log(tipo, nombre, cantidad);
    }
  });
});
app.put("/modificar-producto", (req, res) => {
  const folio = req.body.folio;
  const nombre = req.body.nombre;
  const precio = req.body.precio;
  const cantidad = req.body.cantidad;
  const proveedor = req.body.proveedor;
  const tipo = req.body.tipo;
  const unidadMedida = req.body.unidadMedida;
  const edad = req.body.edad;
  if (tipo !== "Tilapias" && tipo !== "Mojarras") {
    connection.query(
      "UPDATE inventariocosas SET Nombre=?, Tipo=?,PrecioUnitario=?, Proveedor=?, Cantidad=?, UnidadMedida=? WHERE ProductoID = ?;",
      [nombre, tipo, precio, proveedor, cantidad, unidadMedida, folio],
      (error, resultado) => {
        if (error) {
          console.log(res.status(500).send(error));
        } else {
          console.log(
            res.status(200).send("Datos modificados de la tabla inventario")
          );
        }
      }
    );
  } else {
    connection.query(
      "UPDATE inventarioanimales SET Nombre=?, Tipo=?,PrecioUnitario=?, Cantidad=?, Edad=? WHERE ProductoID = ?;",
      [nombre, tipo, precio, cantidad, edad, folio],
      (error, resultado) => {
        if (error) {
          console.log(res.status(500).send(error));
        } else {
          console.log(
            res.status(200).send("Datos modificados de la tabla inventario")
          );
        }
      }
    );
  }
});
app.put("/vendido/:tipo&:id", (req, res) => {});
app.delete("/eliminarVenta/:Id", (req, res) => {
  const folio = req.params.Id;
  connection.query(
    "DELETE FROM kaychiapas.ventas WHERE ID_Venta = ?;",
    [folio],
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(resultado);
      }
    }
  );
});
app.delete("/producto/:Id", (req, res) => {
  const folio = req.params.Id;
  connection.query(
    "SELECT COUNT(*) as c FROM kaychiapas.inventarioanimales WHERE ProductoID = ?;",
    [folio],
    (error, resultado) => {
      if (error) {
        res.status(500).send(error);
      } else {
        if (resultado[0].c == 0) {
          connection.query(
            "DELETE FROM kaychiapas.inventariocosas WHERE ProductoID = ?;",
            [folio],
            (error, resul) => {
              if (error) {
                res.status(500).send(error);
              } else {
                res.status(200).send(resul);
              }
            }
          );
        } else {
          connection.query(
            "DELETE FROM kaychiapas.inventarioanimales WHERE ProductoID = ?;",
            [folio],
            (error, resu) => {
              if (error) {
                res.status(500).send(error);
              } else {
                res.status(200).send(resu);
              }
            }
          );
        }
      }
    }
  );
});
const cerrarDB = () => {
  connection.end((error) => {
    if (error) {
      console.error("Error al cerrar la conexión a MySQL:", error);
    } else {
      console.log("Conexión a MySQL cerrada");
    }
  });
};
//connection.end();
