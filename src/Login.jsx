import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')

    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Введите электронный адрес')
      return
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Введите действительный адрес электронной почты')
      return
    }

    if ('' === password) {
      setPasswordError('Введите пароль')
      return
    }

    if (password.length < 7) {
      setPasswordError('Пароль должен состоять из 8 символов или длиннее.')
      return
    }

    // Check if email has an account associated with it
    checkAccountExists((accountExists) => {
      // If yes, log in
      if (accountExists) logIn()
      // Else, ask user if they want to create a new account and if yes, then log in
      else if (
        window.confirm(
          'Учетная запись не существует с этим адресом электронной почты: ' +
            email +
            '. Вы хотите создать новую учетную запись?'
        )
      ) {
        logIn()
      }
    })
  }

  // Call the server API to check if the given email ID already exists
  const checkAccountExists = (callback) => {
    fetch('http://localhost:3080/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      })
  }

  // Log in a user using email and password
  const logIn = () => {
    fetch('http://localhost:3080/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if ('success' === r.message) {
          localStorage.setItem(
            'user',
            JSON.stringify({ email, token: r.token })
          )
          props.setLoggedIn(true)
          props.setEmail(email)
          navigate('/')
        } else {
          window.alert('Wrong email or password')
        }
      })
  }

  return (
    <div className='mainContainer'>
      <div className='titleContainer'>
        <div>Войти в аккаунт</div>
      </div>
      <br />
      <div className='inputContainer'>
        <input
          value={email}
          placeholder='Введите электронный адрес'
          onChange={(e) => setEmail(e.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{emailError}</label>
      </div>
      <br />
      <div className='inputContainer'>
        <input
          value={password}
          type='password'
          placeholder='Введите пароль'
          onChange={(e) => setPassword(e.target.value)}
          className='inputBox'
        />
        <label className='errorLabel'>{passwordError}</label>
      </div>
      <br />
      <div className='inputContainer'>
        <input
          className='inputButton'
          type='button'
          onClick={onButtonClick}
          value='Войти'
        />
      </div>
    </div>
  )
}
export default Login
