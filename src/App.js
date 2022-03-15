import './scss/App.scss';
import { Input } from 'antd';
import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { Rings } from 'react-loader-spinner'

const { TextArea } = Input;
const apiEndPoint = 'https://api.app.shortcut.com/api/v3/projects'
const SHORTCUT_API_TOKEN = '62307c6b-2cd3-452d-aa0f-52ece579f19a'

function App() {
  const [loading, setLoading] = useState(true);
  const [cli, setCli] = useState('')
  const [extraction, setExtraction] = useState([])
  const [errStatus, setErrorStatus] = useState(false)

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      if (errStatus) {
        setCli('')
        setErrorStatus(false)
      }
      else {
        var fileName = ''
        var ids = []
        var output = []
        if (cli.split('-o')[1] && cli.split('-p')[1]) {
          fileName = cli.split('-o')[1].split(' ')[1]
          ids = cli.split('-p')[1].split(' ')
          if (fileName != '' && ids != []) ids.map(id => {
            extraction.map(list => {
              if (list.id == id) output.push(list)
            })
          })
          downloadFile({
            data: JSON.stringify(output),
            fileName: fileName,
            fileType: 'text/json',
          })
          setErrorStatus(false)
          setCli('')
        } else {
          var msg = ''
          msg = 'filename or ids should be required. please insert -o filename -p ids'
          setCli(msg)
          setErrorStatus(true)
        }
      }
    }
  }

  const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType })
    const a = document.createElement('a')
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(apiEndPoint, { headers: { 'Shortcut-Token': SHORTCUT_API_TOKEN } });
        const extraction = data.map(project => {
          const { id, name, description } = project
          return { id: id, name: name, description: description }
        })
        setExtraction(extraction)
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <div className='container'>
        {loading && <Rings color="#00BFFF" height={100} width={50} />
        }
        {!loading && (
          <React.Fragment>
            <p>
              insert -o filename -p ids, press enter to execute
            </p>
            <TextArea autoFocus rows={4} onKeyDown={keyPress} onChange={(e) => setCli(e.target.value)} value={cli} />
          </React.Fragment>

        )}
      </div>
    </div>
  );
}

export default App;
