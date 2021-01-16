import React, { useState } from 'react';
import './App.scss';
import { Segment, Step, Tab, Icon, Message } from 'semantic-ui-react';
import { S3Form } from './components/s3-form';
import { DropBoxForm } from './components/dropbox-form';
import { FilesMover } from './components/files-move';


function App() {
  const [tabIndex, setTabIndex] = useState(0);
  const [s3Validated, setS3Validated] = useState(false);
  const [dropboxValidated, setDropboxValidated] = useState(false);

  const [formData, setFormData] = useState({
    bucketName: process.env.REACT_APP_BUCKET,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRETACCESS_KEY_ID,
    region: process.env.REACT_APP_AWS_REGION,
    dropboxAccessKey: process.env.REACT_APP_DP_ACCESSKEY
  });
  const [moveData, setMoveData] = useState({
    s3Path: '',
    dropboxPath: ''
  })
  const handleMoveChange = (event, { name, value }) => {
    setMoveData((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleFieldChange = (event, { name, value }) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };


  return (
    <Segment className='dropform'>
      <Step.Group fluid>
        <Step active={tabIndex === 0}>
          <Step.Title>S3</Step.Title>
          <Step.Description>Enter Credentials</Step.Description>
        </Step>
        <Step active={tabIndex === 1}>
          <Step.Title>Dropbox</Step.Title>
          <Step.Description>Enter Credentials</Step.Description>
        </Step>
        <Step active={tabIndex === 2}>
          <Step.Title>Files</Step.Title>
          <Step.Description>Move Selected Files</Step.Description>
        </Step>
      </Step.Group>
      <Tab activeIndex={tabIndex} className='hidden-tab' menu={{ tabular: false }} panes={[
        {
          menuItem: 'Tab 1', render: () => (<Tab.Pane >
            <div className='tab-switch first'>
              <Icon circular name={'arrow right'} onClick={() => setTabIndex(1)} />
            </div>
            <S3Form
              formData={{ ...formData }}
              handleFieldChange={handleFieldChange}
              s3Validated={s3Validated}
              setS3Validated={setS3Validated}
            ></S3Form>
          </Tab.Pane>)
        },
        {
          menuItem: 'Tab 2', render: () => (<Tab.Pane>
            <div className='tab-switch'>
              <Icon circular name={'arrow left'} onClick={() => setTabIndex(0)} />
              <Icon circular name={'arrow right'} onClick={() => setTabIndex(2)} />
            </div>
            <DropBoxForm
              formData={{ ...formData }}
              handleFieldChange={handleFieldChange}
              dropboxValidated={dropboxValidated}
              setDropboxValidated={setDropboxValidated}
            ></DropBoxForm>

          </Tab.Pane>)
        },
        {
          menuItem: 'Tab 3', render: () => (<Tab.Pane>
            <div className='tab-switch'>
              <Icon circular name={'arrow left'} onClick={() => setTabIndex(1)} />
            </div>
            {!(s3Validated && dropboxValidated) && <Message negative>
              <Message.Header>Credentials Error!</Message.Header>
              {!s3Validated && <p>S3 Credentials are not validated</p>}
              {!dropboxValidated && <p>Dropbox Credentials are not validated</p>}
            </Message>}
            <FilesMover credentialsValid={s3Validated && dropboxValidated} formData={{ ...formData }} moveData={{ ...moveData }} handleMoveChange={handleMoveChange}></FilesMover>

          </Tab.Pane>)
        }
      ]} >

      </Tab>
    </Segment>
  );
}

export default App;
