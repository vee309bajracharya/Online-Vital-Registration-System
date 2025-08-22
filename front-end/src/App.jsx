import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PageNotFound from './pages/PageNotFound'

const App = () => {
  return (
    <section className='wrapper'>
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>

      {/* unknown route */}
      <Route path='*' element={<PageNotFound/>}/>

    </Routes>
    
    </BrowserRouter>

    </section>
  )
}

export default App