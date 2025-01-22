import React, { useEffect, useState } from 'react';
import '../css/main.css';
import '../css/request-page.css';
import { useAuth } from '../helpers/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeacherPage() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!user) {
      return;
    }

    // TODO de validat ca field-urile de tip input sa fie completate + un comportament specific (sa se afiseze ceva, sa se coloreze cu rosu etc.)
    const acceptedRequestList = document.getElementById('second-phase-accepted');
    const requestList = document.getElementById('requests-list');
    const finalRequestList = document.getElementById('final-requests-list');

    
    requestList.innerHTML = "";
    finalRequestList.innerHTML = "";
    acceptedRequestList.innerHTML = "";

    getTeacherRequests('finalizata').then((result) => {
      acceptedRequestList.innerHTML = "";
      result.forEach((reqest) => {
        const liElement = document.createElement('li');
        liElement.id = reqest.id;

        const spanName = document.createElement('span');
        spanName.innerHTML = reqest.student_name;
        spanName.classList.add('student-list-span');
      
        liElement.appendChild(spanName);

        const spanTitle = document.createElement('span');
        spanTitle.innerHTML = reqest.title;
        spanTitle.classList.add('student-list-span');
      
        liElement.appendChild(spanTitle);

        let sessionDiv = document.getElementById('session-accepted' + reqest.session_id);
        if (!sessionDiv) {
          sessionDiv = document.createElement('div');
          sessionDiv.id = 'session-accepted' + reqest.session_id;
          sessionDiv.innerHTML += 'session-' + reqest.session_id;

          acceptedRequestList.appendChild(sessionDiv);
        }
        
        sessionDiv.appendChild(liElement);
      });
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });

    if (user.student_number === 0) {
      const p1Element = document.createElement('p');
      p1Element.innerHTML = "Numărul maxim de locuri a fost atins.";

      const p2Element = document.createElement('p');
      p2Element.innerHTML = "Numărul maxim de locuri a fost atins.";

      requestList.appendChild(p1Element);
      finalRequestList.appendChild(p2Element);

      return;
    }

    getTeacherRequests('in asteptare').then((result) => {
      console.log('Data fetched successfully:', result);
      let students = result;

      console.log(students);
      requestList.innerHTML = "";
      students.forEach((student) => {
        const liElement = document.createElement('li');
        liElement.id = student.id;

        const spanName = document.createElement('span');
        spanName.innerHTML = student.student_name;
        spanName.classList.add('student-list-span');
      
        liElement.appendChild(spanName);

        const spanTitle = document.createElement('span');
        spanTitle.innerHTML = student.title;
        spanTitle.classList.add('student-list-span');
      
        liElement.appendChild(spanTitle);

        const acceptRequestBtn = document.createElement("button");
        acceptRequestBtn.innerHTML = 'Acceptă';
        acceptRequestBtn.value = 'acceptata';
        acceptRequestBtn.dataset.requestId = student.id;
        acceptRequestBtn.classList.add('button-30');
        const declineRequestBtn = document.createElement("button");
        declineRequestBtn.innerHTML = 'Respinge';
        declineRequestBtn.value = 'respinsa';
        declineRequestBtn.dataset.requestId = student.id;
        declineRequestBtn.classList.add('button-30');
        liElement.appendChild(acceptRequestBtn);
        liElement.appendChild(declineRequestBtn);

        acceptRequestBtn.addEventListener('click', acceptOrDeclineRequest);
        declineRequestBtn.addEventListener('click', acceptOrDeclineRequest);

        let sessionDiv = document.getElementById('session-' + student.session_id);
        if (!sessionDiv) {
          sessionDiv = document.createElement('div');
          sessionDiv.id = 'session-' + student.session_id;
          sessionDiv.innerHTML += 'session-' + student.session_id;

          requestList.appendChild(sessionDiv);
        }
        
        sessionDiv.appendChild(liElement);

        
      });
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });

    getTeacherRequests('fisier incarcat').then((result) => {
      console.log('Data fetched successfully:', result);
      finalRequestList.innerHTML = "";
      result.forEach((finalRequest) => {
        const liElement = document.createElement('li');
        liElement.id = finalRequest.id;

        const spanName = document.createElement('span');
        spanName.innerHTML = finalRequest.student_name;
        spanName.classList.add('student-list-span');
      
        liElement.appendChild(spanName);

        const spanTitle = document.createElement('span');
        spanTitle.innerHTML = finalRequest.title;
        spanTitle.classList.add('student-list-span');
      
        liElement.appendChild(spanTitle);

        const inputFile = document.createElement("input");
        inputFile.type = 'file';
        liElement.appendChild(inputFile);

        const uploadFileBtn = document.createElement("button");
        uploadFileBtn.innerHTML = "Încarcă fișier";
        uploadFileBtn.classList.add('upload-file');
        uploadFileBtn.classList.add('button-30');
        liElement.appendChild(uploadFileBtn);

        const rejectBtn = document.createElement("button");
        rejectBtn.innerHTML = "Respinge";
        rejectBtn.classList.add('upload-file');
        rejectBtn.classList.add('button-30');
        liElement.appendChild(rejectBtn);

        uploadFileBtn.addEventListener('click', () => {
          if (inputFile.files.length > 0) {
            // Access the selected file
            const selectedFile = inputFile.files[0];
    
            // Log or use the selected file
            console.log('Selected File:', selectedFile);
            handleUpload(selectedFile);
            updateRequest('finalizata',finalRequest.id);
            updateTeacher();
            liElement.style.display = 'none';
          } else {
            console.warn('No file selected.');
            toast.warning('Niciun fisier selectat');
          }
        });

        rejectBtn.addEventListener('click', () => {
          openRejectPopup();
          
          document.getElementById('final-reject-btn').addEventListener('click', () => {
            const rejectMessage = document.getElementById('reject-message').value;
            updateRequest('respinsa',finalRequest.id, rejectMessage);
            liElement.style.display = 'none';
            closePopup();
          })
        });

        let sessionDiv = document.getElementById('session-final' + finalRequest.session_id);
        if (!sessionDiv) {
          sessionDiv = document.createElement('div');
          sessionDiv.id = 'session-final' + finalRequest.session_id;
          sessionDiv.innerHTML += 'session-' + finalRequest.session_id;

          finalRequestList.appendChild(sessionDiv);
        }
        
        sessionDiv.appendChild(liElement);

        
      });
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  function openPopup() {
    document.getElementById('overlay').style.display = 'flex';
    document.querySelector('#close-btn').addEventListener('click', closePopup);
  }

  function saveSession() {
    addSession();
    // document.getElementById('overlay-success').style.display = 'flex';
    // document.querySelector('#close-success-popup-btn').addEventListener('click', closePopup);
  }

  function acceptOrDeclineRequest(e) {
    const status = e.target.value;
    const requestId = e.target.dataset.requestId;

    updateRequest(status, requestId);
    document.getElementById(requestId).style.display = 'none';
  }

  function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('overlay-success').style.display = 'none';
    document.getElementById('overlay-reject').style.display = 'none';
  }

  const getTeacherRequests = async (status) => {
    try {
      const response = await fetch('http://localhost:5002/api/filterRequests?teacherId=' + user.id + '&status=' + status, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', 
          } 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const addSession = async () => {
    try {
    if(!startDate || !endDate || startDate > endDate)
    {
      toast.error('Date incorecte');
      return;
    }
    
      const postData = {
        teacher_id: user.id,
        start_date: startDate,
        end_date: endDate,
      };
      console.log(postData);
      const response = await fetch('http://localhost:5002/api/NewSession', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(postData) 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      toast.success('Sesiune salvata');
      return result;
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const updateRequest = async (status, requestId, rejectMessage = '') => {
    try {
      const postData = {
        status : status,
        reject_message : rejectMessage
      };
      console.log(postData);
      const response = await fetch('http://localhost:5002/api/dissertation_requests/' + requestId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(postData) 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      return result;
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  const handleUpload = async (selectedFile) => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('http://localhost:5002/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('File uploaded successfully!');
          toast.success('Fiser incarcat');
        } else {
          console.error('Failed to upload file.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.warn('No file selected for upload.');
    }
  };

  const updateTeacher = async () => {
    try {
      const postData = {
        student_number : user.student_number - 1
      };
      const response = await fetch('http://localhost:5002/api/users/' + user.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(postData) 
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      return result;
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } 
  };

  function openRejectPopup() {
    document.getElementById('overlay-reject').style.display = 'flex';
    document.querySelector('#close-reject-popup-btn').addEventListener('click', closePopup);
  }

  if (!user) {
    return <div>User not authenticated</div>;
  }

    return (
      <div>
        <div className='content-div'>
          <button id='add-session-btn' className='button-30' style={{display:'block'}} onClick={openPopup}>Add session</button>
          <h1>Requests list</h1>
          <ul id='requests-list'>

          </ul>

          <div className="overlay" id="overlay">
            <div className="popup">
              <span className="close-btn" id='close-btn'>X</span>
              <h2>New session</h2>
              <p>Fill in start and end dates.</p>
              <div>
                <div>Start Date: </div>
                <input 
                type="datetime-local" 
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <div>End Date: </div>
                <input 
                type="datetime-local" 
                id='end-date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <button className='button-30' id='add-session-btn' onClick={saveSession}>Save</button>
            </div>
          </div>

          <div className="overlay" id="overlay-success">
            <div className="popup">
              <span className="close-btn" id='close-success-popup-btn'>X</span>
              <h2>Session was saved successfully</h2>
            </div>
          </div>
        </div>

        <div className='content-div'>
          <h1>Accepted requests</h1>
          <ul id='final-requests-list'>

          </ul>
        </div>

        <div className='content-div'>
          <h1>Finished requests</h1>
          <ul id='second-phase-accepted'>

          </ul>
        </div>

        <div className="overlay" id="overlay-reject">
          <div className="popup">
            <span className="close-btn" id='close-reject-popup-btn'>X</span>
            <h2>Fill in the refusal reason</h2>
            <input 
            type='text'
            required
            id='reject-message'
            ></input>
            <div><button className='button-30' id='final-reject-btn'>Refuse</button></div>
          </div>
        </div>
        <ToastContainer/>
      </div>
    );
  }
  
  export default TeacherPage;
  