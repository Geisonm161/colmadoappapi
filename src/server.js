import 'dotenv/config';
import { app } from './app.js';

const port = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET no está configurado. Define un valor seguro en producción.');
}

app.listen(port, () => {
  console.log(`ColmadoApp API escuchando en puerto ${port}`);
});
