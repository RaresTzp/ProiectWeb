import React, { useEffect, useState } from 'react';
import '../css/main.css';
import '../css/request-page.css';
import { useAuth } from '../helpers/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StudentPage() {
  const { user } = useAuth();
  const [dissertationTopic, setDissertationTopic] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [hasErrorNotification, setHasErrorNotification] = useState(true);

  let teacherId;

    useEffect(() => {
      if (!user) {
        return;
      }

      getFinalRequest().then((result) => {
        console.log('Data fetched successfully:', result);
        if (result !== null && result.length > 0) {
          const finalRequest = result[0];
          // TODO de adaugat clasa si stilizat
          const pElement = document.createElement('p');
          pElement.innerHTML = 'Cererea de dissertație aprobată este ' + finalRequest.title + " - " + finalRequest.session_id;
          if (document.getElementById('main-div')) {
          document.getElementById('main-div').innerHTML = '';
          document.getElementById('main-div').appendChild(pElement);}
          const contentDivs = document.getElementsByClassName('content-div');
          Array.from(contentDivs).forEach(div => div.style.display = 'none');
        }
        
      }).catch((error) => {
        console.error('Error fetching data:', error);
      });

      fetchData().then((result) => {
        console.log('Data fetched successfully:', result);
        const teacherList = document.getElementById('available-teacher-list');
          const teachers = result;
      
          if(teacherList){
          teacherList.innerHTML = "";
          teachers.forEach((teacher) => {
            const liElement = document.createElement('li');

            const spanName = document.createElement('span');
            spanName.innerHTML = teacher.name;
            spanName.classList.add('teacher-list-span');
            
            const spanNumber = document.createElement('span');
            spanNumber.innerHTML = teacher.student_number + ' available spots';
            spanNumber.classList.add('teacher-list-span');

            liElement.appendChild(spanName);
            liElement.appendChild(spanNumber);

            const sendRequestBtn = document.createElement("button");
            sendRequestBtn.classList.add('button-30');
            sendRequestBtn.classList.add('open-popup-btn');
            sendRequestBtn.dataset.teacher = teacher.id;
            sendRequestBtn.innerHTML = "Send Request";
            liElement.appendChild(sendRequestBtn);
            if (teacher.student_number === 0 || teacher.student_number === null) {
              sendRequestBtn.style.visibility = 'hidden';
            }

            teacherList.appendChild(liElement);
          });

          const openPopupBtns = document.querySelectorAll('.open-popup-btn');
          console.log(openPopupBtns);
          openPopupBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
              
              teacherId = btn.dataset.teacher;
              // Verifică dacă studentul a trimis deja cerere la profesor
              const existingRequest = await checkExistingRequest(user.id, teacherId);  
              console.log("student id", user.id);   
              console.log("teacher id", teacherId);
              console.log("existingRequest", existingRequest);    
              if (existingRequest) {
                // Există deja o cerere
                toast.error('Ați trimis deja o cerere la profesorul respectiv.');
              } else {
                setTeacher(teacherId);
                openPopup();

              getTeacherSessions().then((result) => {
                console.log(result)
                const dropdown = document.getElementById('session-list');
                dropdown.innerHTML = '';
                const option = document.createElement('option');
                option.text = 'Sesiune';
                dropdown.add(option);

                // Add new options
                result.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.text = item.start_date + ' - ' + item.end_date;
                    dropdown.add(option);
                });

              }).catch((error) => {
                console.error('Error fetching data:', error);
              });
            }
            });
          });}
      }).catch((error) => {
        console.error('Error fetching data:', error);
      });

      getAcceptedRequests().then((result) => {
        console.log(result);
        console.log('Data fetched successfully:', result);
        const acceptedList = document.getElementById('first-phase-accepted');
          if(acceptedList){
          acceptedList.innerHTML = "";
          result.forEach((request) => {
            console.log(request.id);
            const liElement = document.createElement('li');
            
            const spanTitle = document.createElement('span');
            spanTitle.innerHTML = request.title;
            spanTitle.classList.add('teacher-list-span');

            const spanSession = document.createElement('span');
            spanSession.innerHTML = request.session_id;
            spanSession.classList.add('teacher-list-span');
            
            liElement.appendChild(spanTitle);
            liElement.appendChild(spanSession);

            const inputFile = document.createElement("input");
            inputFile.type = 'file';
            liElement.appendChild(inputFile);

            const uploadFileBtn = document.createElement("button");
            uploadFileBtn.innerHTML = "Încarcă fișier";
            uploadFileBtn.classList.add('upload-file');
            uploadFileBtn.classList.add('button-30');
            liElement.appendChild(uploadFileBtn);
      
            acceptedList.appendChild(liElement);

            uploadFileBtn.addEventListener('click', () => {
              if (inputFile.files.length > 0) {
                // Access the selected file
                const selectedFile = inputFile.files[0];
        
                // Log or use the selected file
                console.log('Selected File:', selectedFile);
                handleUpload(selectedFile);
                updateRequest(request.id);
                liElement.style.display = 'none';
              } else {
                console.warn('No file selected.');
                toast.warning('Nu ati ales niciun fisier');
              }
            });
          });}
      }).catch((error) => {
        console.error('Error fetching data:', error);
      });

      const confirmSendBtn = document.getElementById('send-request-btn');
      const sendRequestHandler = () => {
        //Se verifica pentru validatea campurilor cum este hasErrorNotification(declarat la inceput), in functie de asta trece mai departe sau nu
        console.log("call sendRequest");
        console.log("hasErrorNotification1:", hasErrorNotification);
        if(hasErrorNotification === false){
        sendRequest();
        //Dezactivează ascultătorul de evenimente după ce este apelată funcția sendRequest.
        confirmSendBtn.removeEventListener('click', sendRequestHandler);
      }

      };
      confirmSendBtn.addEventListener('click', sendRequestHandler);
      return () => {
        // Detașează ascultătorul de evenimente pentru a evita memory leak.
        confirmSendBtn.removeEventListener('click', sendRequestHandler);
      };

    }, [dissertationTopic, sessionId, hasErrorNotification]);

      function openPopup() {
        console.log("openpopup");
        resetForm(); //pentru a se reseta valorile formularului de sendDissertationRequest
        document.getElementById('overlay').style.display = 'flex';
        document.querySelector('#close-btn').addEventListener('click', closePopup);
      }

      //daca campurile din sendDissertationRequest sunt completate corect se efectueaza sendRequest
      function sendRequest() {
        console.log("sendRequest");
        document.getElementById('overlay-success').style.display = 'flex';
        document.querySelector('#close-success-popup-btn').addEventListener('click', closePopup);
        console.log("hasErrorNotification2:", hasErrorNotification);
      }
  
      function closePopup() {
        console.log("closepopup");
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('overlay-success').style.display = 'none';
      }

      ////pentru a se reseta valorile formularului de sendDissertationRequest
      function resetForm() {
        setDissertationTopic('');
        setSessionId(null);
      }

      // Funcție pentru a verifica existența unei cereri în funcție de student_id și teacher_id
      async function checkExistingRequest(studentId, teacherId) {
        try {
          console.log("Checking existing request:", studentId, teacherId);
          const response = await fetch(`http://localhost:5002/api/checkExistingRequest?studentId=${studentId}&teacherId=${teacherId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log("result", result);
          console.log(result.exists);
          return result.exists;
        } catch (error) {
          console.error('Error checking existing request:', error);
          return false;
        }
      }

      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:5002/api/filterUsers?account_type=profesor', {
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

      const getTeacherSessions = async () => {
        try {
          console.log(teacherId);
          const response = await fetch('http://localhost:5002/api/filterSessions?teacher_id=' + teacherId, {
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

      const sendDissertationRequest = async () => {
        try {
          console.log("senddissertationrequest");
          //Pentru validate campuri
              let canProceed = true;
              if (!dissertationTopic.trim()) {
                toast.error('Completați tema înainte de a trimite cererea.');
                console.log("fara tema");
                canProceed = false; 
              }          
              if (!sessionId) {
                toast.error('Selectați sesiunea înainte de a trimite cererea.');
                console.log("fara sesiune");
                canProceed = false; 
              }
              //in functie de rezultat setam hasErrorNotification
              if (!canProceed) {
                setHasErrorNotification(true);
                return;
              }
              else
              {
                setHasErrorNotification(false);
              }

              const postData = {
                teacher_id: teacher,
                student_id: user.id,
                title: dissertationTopic,
                session_id: sessionId,
                student_name: user.name,
                status: 'in asteptare'
              };
    
              const response = await fetch('http://localhost:5002/api/newRequest', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json', 
                },
                body: JSON.stringify(postData), 
              });
            
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const result = await response.json();
          console.log(result);
          toast.success('Cerere trimisa');
          return result;
        
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('A apărut o eroare la trimiterea cererii.');
          setHasErrorNotification(true);
        } 
      };

      const getAcceptedRequests = async () => {
        try {
          const response = await fetch('http://localhost:5002/api/filterRequests?studentId=' + user.id + '&status=acceptata', {
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

      const getFinalRequest = async () => {
        try {
          const response = await fetch('http://localhost:5002/api/filterRequests?studentId=' + user.id + '&status=finalizata', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json', 
              } 
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
              toast.success('Fisier incarcat');
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

      const updateRequest = async (requestId) => {
        try {
          const postData = {
            status : "fisier incarcat"
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

      if (!user) {
        return <div>User not authenticated</div>;
      }

    return (
      <div id='main-div'>
        <div className='content-div'>
          <h1 className='lista-prof'>Professors list</h1>
          <ul id='available-teacher-list'>

          </ul>

          <div className="overlay" id="overlay">
            <div className="popup">
              <span className="close-btn" id='close-btn'>X</span>
              <h2 className='cerere-dis'>Thesis request</h2>
              <p className='tema'>Fill in the thesis theme.</p>
              <input 
              type='text' 
              placeholder='Tema' 
              id='dissertation-topic' 
              required
              value={dissertationTopic}
              onChange={(e) => setDissertationTopic(e.target.value)}>  
              </input>

            <div>
              <div className='sesiune-dor'>Select the desired session: </div>
              <select id='session-list' required value={sessionId || ''} onChange={(e) => {setSessionId(e.target.value);console.log(e.target.value)}}>
              </select>
            </div>

              <button className='button-30' id='send-request-btn' onClick={sendDissertationRequest}>Send</button>
            </div>
          </div>

          <div className="overlay" id="overlay-success">
            <div className="popup">
              <span className="close-btn" id='close-success-popup-btn'>X</span>
              <h2>Request was sent successfully!</h2>
              <p>Waiting for teacher response</p>
            </div>
          </div>
        </div>

        <div className='content-div'>
          <h1 className='cereri-acc'>Accepted Requests</h1>
          <ul id='first-phase-accepted'>

          </ul>
        </div>
        
        <ToastContainer/>
      </div>
    );
  }
  
  export default StudentPage;
  