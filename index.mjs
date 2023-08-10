import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import cors from 'cors'

const app = express();
const port = 5174;
app.use(cors());

// Configuración de Multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'prosweb.comind@gmail.com',
    pass: 'jznzlkyddiyqupth'
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to sendForm COMIND')
})

app.post('/send-email', upload.single('image'), async (req, res) => {
    const {
      type,
      proposed,
      typeFluid,
      temp,
      unidTemp,
      pressure,
      length,
      unidExtend,
      diameterInt,
      diameterExt,
      description,
      image,
      name,
      cell,
      email,
      city,
      state,
      country,
      notes
    } = req.body;

    const attachments = [];

    if (req.file) {
      attachments.push({
        filename: `img_reference_pedido_${name}.png`,
        content: req.file.buffer,
        contentType: 'image/png'
      });
    }
  
    const dataProperties = [
      { label: 'Telefono', value: cell },
      { label: 'City', value: city },
      { label: 'Estado', value: state },
      { label: 'Pais', value: country },
      { label: 'Tipo de manguera', value: type },
      { label: 'Proposito', value: proposed },
      { label: 'Tipo de fluido', value: typeFluid },
      { label: 'Temperatura', value: `${temp} ${unidTemp}` },
      { label: 'Presion', value: pressure },
      { label: 'Longitud', value: length },
      { label: 'Diametro interior', value:`${diameterInt} ${unidExtend}`},
      { label: 'Diametro exterior', value:`${diameterExt} ${unidExtend}`},
      { label: 'Descripcion de ensamble', value: description },
      { label: 'Notas adicionales', value: notes },
    ];
  
    const propertiesList = dataProperties
      .map(({ label, value }) => `${label}: ${value}`)
      .join('\n');
  
      const notificationOptions = {
        from: 'prosweb.comind@gmail.com',
        to: 'info-web@comind.mx',
        subject: 'Nuevo pedido de mangueras desde el sitio web',
        text: `Nombre: ${name}\nEmail: ${email}\n\nDetalles de pedido:\n${propertiesList}`,
        attachments: attachments
      };

      try {
        // Envío del correo de notificación
        await transporter.sendMail(notificationOptions);
    
        console.log('Correos enviados con éxito');
        res.status(200).send('Correos enviados con éxito.');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al enviar los correos.');
      }
    
  });
  

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
