import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const Documentos = () => {
  const [documentosGuardados, setDocumentosGuardados] = useState([]);
  const [visibilidadListas, setVisibilidadListas] = useState({
    transporte: false,
    alojamiento: false,
    otros: false,
  });

  useEffect(() => {
    obtenerDocumentos();
  }, []);
  /*
    localhost:8080/documento/viaje/{idViaje} -> esta llamada devuelve todos los id de documentos, nombre y tipo de un idViaje
    luego si lo queres ver podes llamar a -> localhost:8080/documento/{id} 
  */
  const obtenerDocumentos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/documento/viaje/1"
      );
      setDocumentosGuardados(response.data);
      console.log("Documentos obtenidos correctamente:", response.data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarDocumentos = async (idDocumento) => {
    await axios.delete("http://localhost:8080/documento/"+idDocumento , {responseType: "arraybuffer"})

    setDocumentosGuardados((prevDocumentos) =>
      prevDocumentos.filter((doc) => doc.id !== idDocumento)
    );
  }

  const descargarDocumento = async (idDocumento,nombreDocumento) => { 
    const response= await axios.get("http://localhost:8080/documento/"+idDocumento+"/descargar")
    console.log(response.data)

    const blob = new Blob([response.data], {type: "application/pdf"})

    const url = window.URL.createObjectURL(blob)

    const a = document.createElement('a');
    a.href= url;
    a.download= nombreDocumento;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
  }




  const toggleVisibilidadLista = (tipo) => {
    setVisibilidadListas((prevVisibilidadListas) => ({
      ...prevVisibilidadListas,
      [tipo]: !prevVisibilidadListas[tipo],
    }));
  };

  const ListaDesplegable = ({ tipo, documentos }) => (
    <div>
      <h2
        onClick={() => toggleVisibilidadLista(tipo)}
        style={{ cursor: "pointer" }}
      >
        {tipo} {visibilidadListas[tipo] ? "▼" : "►"}
      </h2>
      {visibilidadListas[tipo] && (
        <ul>
          {documentos
            .filter((doc) => doc.tipo === tipo)
            .map((doc, index) => (
              <li key={index}>
                <strong>Título:</strong> {doc.nombreDocumento}
                <button onClick={() => descargarDocumento(doc.id,doc.nombreDocumento)}>Descargar</button>
                <button onClick={() => eliminarDocumentos(doc.id)}>Eliminar</button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      <h1>Documentos</h1>
      <h3>----------------------</h3>
      <ListaDesplegable tipo="Transporte" documentos={documentosGuardados} />
      <h3></h3>
      <ListaDesplegable tipo="Alojamiento" documentos={documentosGuardados} />
      <h3></h3>
      <ListaDesplegable tipo="Otros" documentos={documentosGuardados} />

      <Link to="/Documentos/AgregarDocumentos">
        <button>Agregar Documento</button>
      </Link>

      <Link to="/Home">
        <button>Volver</button>
      </Link>
    </>
  );
};