import express from "express";
import { nanoid } from "nanoid";
import { writeFile, readFile } from "node:fs/promises";
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
    const fsResponse = await readFile("canciones.json", "utf-8");
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cancion:
 *                 type: string
 *               artista:
 *                 type: string
 *               tono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Canción agregada
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
 */
app.post("/canciones", async (req, res) => {
    const { cancion, artista, tono } = req.body;
    const nuevaCancion = {
        id: nanoid(),
        cancion,
        artista,
        tono,
    };
    let canciones = await getCanciones();
    canciones.push(nuevaCancion);
    await writeFile("canciones.json", JSON.stringify(canciones));
    res.status(201).json(nuevaCancion);
});

/**
 * @swagger
 * /canciones/{id}:
 *   put:
 *     summary: Actualizar una canción por ID
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
 *                 description: Nombre de la canción
 *               artista:
 *                 type: string
 *                 description: Artista de la canción
 *               tono:
 *                 type: string
 *                 description: Tono de la canción
 *     responses:
 *       200:
 *         description: Canción actualizada
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
app.put("/canciones/:id", async (req, res) => {
    const id = req.params.id;
    const { cancion, artista, tono } = req.body;
    let canciones = await getCanciones();
    const cancionIndex = canciones.findIndex((cancion) => cancion.id === id);

    if (cancionIndex === -1) {
        res.status(404).json({ message: "Canción no encontrada" });
    } else {
        if (cancion !== undefined) canciones[cancionIndex].cancion = cancion;
        if (artista !== undefined) canciones[cancionIndex].artista = artista;
        if (tono !== undefined) canciones[cancionIndex].tono = tono;

        await writeFile("canciones.json", JSON.stringify(canciones));
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
        await writeFile("canciones.json", JSON.stringify(canciones));
        res.json(cancionEliminada[0]);
    }
});