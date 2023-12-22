'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

function App() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  const handleSubmit = async (e) => {



	e.preventDefault();
		
    try {
      const response = await fetch("http://127.0.0.1:8080/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_name: username, password: password })
      });

      if (response.ok) {
         router.push("/administradores");
      } else {
        alert("Algo ha salido mal");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="top-band bg-primary text-white text-left py-2">
        Plataforma educativa
      </div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
              
                <h2 className="card-title text-center">Iniciar Sesión</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Nombre de Usuario</label>
                    <input
                      type="email"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary rounded-pill w-100 ">Entrar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
