import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Nav from './components/Nav';
import StudentPage from './components/StudentPage';
import TeacherPage from './components/TeacherPage';
import { AuthProvider } from './helpers/authContext';

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/student-page" element={<StudentPage />} />
            <Route path="/teacher-page" element={<TeacherPage />} />
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
