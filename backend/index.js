import express from "express";
import { nanoid } from "nanoid";
import { writeFileSync, readFileSync } from "fs";
import cors from "cors";

/* Test Swagger */
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

// Configuración Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mi Repertorio API - Desafío Latam",
            version: "1.0.0",
            description: "API para gestionar desafío 'Mi Repertorio'",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Servidor local",
            },
        ],
    },
    apis: ["./index.js"],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("../frontend"));


app.get("/", (req, res) => {
    res.send("Bienvenido a Mi Repertorio API. Visita http://localhost:5000/api-docs para la documentación.");
});

// Ruta de documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(5000, () => {
    console.log("\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓"+
                "\n¤ Desafío 'Mi Repertorio' activo en puerto: 5000 ¤"+
                "\n\n¤¤¤    Front: http://localhost:5000/           ¤¤¤"+
                "\n¤¤¤  Swagger: http://localhost:5000/api-docs/  ¤¤¤"+
                "\n\n¤¤¤   Ingresa con CTRL + CLICK en cada link ;) ¤¤¤"+
                "\n▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
});

// AUXILIARES
const getCanciones = async () => {
    const fsResponse = await readFileSync("canciones.json", "utf-8");
    const canciones = JSON.parse(fsResponse);
    return canciones;
};

// ENDPOINTS

/**
 * @swagger
 * /canciones:
 *   get:
 *     summary: Obtener todas las canciones
 *     responses:
 *       200:
 *         description: Listado de canciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   cancion:
 *                     type: string
 *                   artista:
 *                     type: string
 *                   tono:
 *                     type: string
 */
app.get("/canciones", async (req, res) => {
    const canciones = await getCanciones();
    res.json(canciones);
});

/**
 * @swagger
 * /canciones/{id}:
 *   get:
 *     summary: Obtener una canción por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la canción
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Canción encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 cancion:
 *                   type: string
 *                 artista:
 *                   type: string
 *                 tono:
 *                   type: string
 *       404:
 *         description: Canción no encontrada
 */
app.get("/canciones/:id", async (req, res) => {
    const id = req.params.id;
    const canciones = await getCanciones();
    const cancion = canciones.find((cancion) => cancion.id === id);
    if (!cancion) {
        res.status(404).json({ message: "Canción no encontrada" });
    } else {
        res.json(cancion);
    }
});

/**
 * @swagger
 * /canciones:
 *   post:
 *     summary: Agregar una nueva canción
 *     description: Agrega una nueva canción al repertorio. Todos los campos son obligatorios y deben contener al menos 1 carácter.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancion
 *               - artista
 *               - tono
 *             properties:
 *               cancion:
 *                 type: string
 *                 description: Nombre de la canción
 *               artista:
 *                 type: string
 *                 description: Artista de la canción
 *               tono:
 *                 type: string
 *                 description: Tono de la canción
 *     responses:
 *       201:
 *         description: Canción agregada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Identificador único de la canción
 *                 cancion:
 *                   type: string
 *                   description: Nombre de la canción
 *                 artista:
 *                   type: string
 *                   description: Artista de la canción
 *                 tono:
 *                   type: string
 *                   description: Tono de la canción
 *       400:
 *         description: Error de validación. Todos los campos son obligatorios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error
 */

app.post("/canciones", async (req, res) => {
    const { cancion, artista, tono } = req.body;

    // Validación: Verificar que los campos no estén vacíos
    if (
        !cancion || cancion.trim().length < 1 ||
        !artista || artista.trim().length < 1 ||
        !tono || tono.trim().length < 1
    ) {
        return res.status(400).json({
            message: "Todos los campos (cancion, artista, tono) son obligatorios y deben contener al menos 1 carácter.",
        });
    }

    const nuevaCancion = {
        id: nanoid(),
        cancion: cancion.trim(),
        artista: artista.trim(),
        tono: tono.trim(),
    };

    let canciones = await getCanciones();
    canciones.push(nuevaCancion);

    await writeFileSync("canciones.json", JSON.stringify(canciones, null, 3));
    res.status(201).json(nuevaCancion);
});


/**
 * @swagger
 * /canciones/{id}:
 *   put:
 *     summary: Actualizar una canción por ID
 *     description: Actualiza una canción en el repertorio. Todos los campos enviados deben contener al menos 1 carácter válido. Los campos no enviados no serán actualizados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la canción
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancion:
 *                 type: string
 *                 description: Nombre de la canción. Debe tener al menos 1 carácter.
 *               artista:
 *                 type: string
 *                 description: Artista de la canción. Debe tener al menos 1 carácter.
 *               tono:
 *                 type: string
 *                 description: Tono de la canción. Debe tener al menos 1 carácter.
 *     responses:
 *       200:
 *         description: Canción actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de la canción
 *                 cancion:
 *                   type: string
 *                   description: Nombre actualizado de la canción
 *                 artista:
 *                   type: string
 *                   description: Artista actualizado de la canción
 *                 tono:
 *                   type: string
 *                   description: Tono actualizado de la canción
 *       400:
 *         description: Error de validación. Todos los campos enviados deben contener al menos 1 carácter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detalle del error de validación
 *       404:
 *         description: Canción no encontrada
 */

app.put("/canciones/:id", async (req, res) => {
    const id = req.params.id;
    const { cancion, artista, tono } = req.body;

    // Validar que los campos no estén vacíos
    if (
        (cancion !== undefined && cancion.trim().length < 1) ||
        (artista !== undefined && artista.trim().length < 1) ||
        (tono !== undefined && tono.trim().length < 1)
    ) {
        return res.status(400).json({
            message: "Todos los campos (cancion, artista, tono) deben contener al menos 1 carácter si se envían.",
        });
    }

    let canciones = await getCanciones();
    const cancionIndex = canciones.findIndex((cancion) => cancion.id === id);

    if (cancionIndex === -1) {
        res.status(404).json({ message: "Canción no encontrada" });
    } else {
        // Actualizar solo los campos que se envían y son válidos
        if (cancion !== undefined) canciones[cancionIndex].cancion = cancion.trim();
        if (artista !== undefined) canciones[cancionIndex].artista = artista.trim();
        if (tono !== undefined) canciones[cancionIndex].tono = tono.trim();

        // Guardar los cambios en el archivo
        await writeFileSync("canciones.json", JSON.stringify(canciones, null, 3));
        res.json(canciones[cancionIndex]);
    }
});


/**
 * @swagger
 * /canciones/{id}:
 *   delete:
 *     summary: Eliminar una canción por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la canción
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Canción eliminada
 *       404:
 *         description: Canción no encontrada
 */
app.delete("/canciones/:id", async (req, res) => {
    const id = req.params.id;
    let canciones = await getCanciones();
    const cancionIndex = canciones.findIndex((cancion) => cancion.id === id);

    if (cancionIndex === -1) {
        res.status(404).json({ message: "Canción no encontrada" });
    } else {
        const cancionEliminada = canciones.splice(cancionIndex, 1);
        await writeFileSync("canciones.json", JSON.stringify(canciones, null, 3));
        res.json(cancionEliminada[0]);
    }
});