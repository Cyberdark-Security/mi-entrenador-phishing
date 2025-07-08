# Mi Entrenador de Phishing 🎣

Una aplicación web sencilla diseñada para simular un ataque de phishing con fines educativos. El objetivo es ayudar a los usuarios a reconocer las señales de un ataque y entender los riesgos de interactuar con enlaces y formularios sospechosos.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCyberdark-Security%2Fmi-entrenador-phishing)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Concepto del Proyecto

La simulación sigue un flujo de tres pasos para educar al usuario:

1.  **📧 Correo Simulado (`index.html`):** Se presenta una página que imita un correo electrónico con una alerta de seguridad y un enlace para "verificar la cuenta".
2.  **🔒 Página de Phishing (`login.html`):** Al hacer clic en el enlace, el usuario es dirigido a una página de inicio de sesión falsa que solicita credenciales.
3.  **🎓 Resultado Educativo (`resultado.html`):** Después de que el usuario envía el formulario, en lugar de robar los datos, la aplicación lo redirige a una página de advertencia que explica que ha participado en una simulación y le ofrece consejos de seguridad.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un enfoque minimalista y eficiente, ideal para despliegues rápidos en la nube.

* **Frontend:** HTML, CSS, JavaScript.
* **Backend:** Python con el micro-framework **Flask**.
* **Plataforma de Despliegue:** **Vercel**.

---



## 📄 Licencia

Este proyecto está distribuido bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
