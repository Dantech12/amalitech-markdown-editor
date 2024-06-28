import React, { useState, useEffect } from 'react';
import Editor from './markdown_editor';
import Preview from './markdown_preview';
import open from '../src/icons/hamburger-menu.png';
import trash from '../src/icons/images (2).png';
import cancel from '../src/icons/icons8-cancel-50.png';
import light from '../src/icons/icons8-light-mode-78.png';
import dark from '../src/icons/icons8-dark-mode-24.png';
import doc from '../src/icons/file-line-icon-doc-document-page-paper-sheet-archive-form-text-word-empty-blank-black-white-graphic-clipart-artwork-outline-symbol-sign-eps-vector.png';
import disk from '../src/icons/floppy-disk-png-icon-free-download-769250.png';
import show from '../src/icons/icons8-eye-24.png';
import hide from '../src/icons/icons8-hide-50.png';

import './App.css';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [documents, setDocuments] = useState({});
  const [currentDoc, setCurrentDoc] = useState('');
  const [notification, setNotification] = useState('');
  const [theme, setTheme] = useState('default');
  
  const [isFullPagePreview, setIsFullPagePreview] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [newDocCount, setNewDocCount] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState('');

  useEffect(() => {
    const savedDocuments = JSON.parse(localStorage.getItem('documents')) || {};
    setDocuments(savedDocuments);

    const savedTheme = localStorage.getItem('theme') || 'default';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleMarkdownChange = (value) => {
    setMarkdown(value);
  };

  const saveDocument = () => {
    if (currentDoc) {
      setDocuments((prevDocuments) => ({
        ...prevDocuments,
        [currentDoc]: { content: markdown, date: new Date() }
      }));
      showNotification(`Document "${currentDoc}" saved.`);
    }
  };

  const createNewDocument = () => {
    const newDocName = `untitled document ${newDocCount}`;
    setMarkdown('');
    setCurrentDoc(newDocName);
    setDocuments((prevDocuments) => ({
      ...prevDocuments,
      [newDocName]: { content: '', date: new Date() }
    }));
    setNewDocCount(newDocCount + 1);
  };

  const loadDocument = (name) => {
    setMarkdown(documents[name].content);
    setCurrentDoc(name);
  };

  const deleteDocument = () => {
    if (currentDoc) {
      setDocToDelete(currentDoc);
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDeleteDocument = () => {
    const name = docToDelete;
    setDocuments((prevDocuments) => {
      const { [name]: _, ...rest } = prevDocuments;
      return rest;
    });

    if (currentDoc === name) {
      setMarkdown('');
      setCurrentDoc('');
    }

    showNotification(`Document "${name}" deleted.`);
    setIsDeleteModalOpen(false);
    setDocToDelete('');
  };

  const updateDocumentName = (e) => {
    const newName = e.target.value;
    if (currentDoc && newName && newName !== currentDoc) {
      setDocuments((prevDocuments) => {
        const { [currentDoc]: currentDocData, ...rest } = prevDocuments;
        return { ...rest, [newName]: currentDocData };
      });
      setCurrentDoc(newName);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000); // Notification will disappear after 3 seconds
  };

  const toggleFullPagePreview = () => {
    setIsFullPagePreview(!isFullPagePreview);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'default' ? 'dark' : 'default'));
  };

  const handleDocumentNameChange = (e) => {
    const newName = e.target.value;
    if (newName === '') {
      setCurrentDoc('');
    } else {
      setCurrentDoc(newName);
    }
  };

  return (
    <div className={`app ${theme}`}>
      <div className="main-content">
        {isSidebarVisible && (
          <div className="sidebar">
            <div className="label-doc">
              <div className="doc1">
                <h1>Markdown</h1>
                <span>MY DOCUMENTS</span>
              </div>
            </div>
            <button className='new-button' onClick={createNewDocument}>+ New Document</button>
            <ul className='contain-items'>
              {Object.keys(documents).map((name) => (
                <li key={name}>
                  <div onClick={() => loadDocument(name)} className="document-info">
                    <img src={doc} alt="Document Icon" className="doc-logo1" height={30} />
                    <div className='document_info'>
                      <span className="document-name">{name ? `${name}.md` : ''}</span>
                      <span className="document-date">{new Date(documents[name].date).toDateString()}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="theme-toggle-container">
              <img src={light} className='light' height={35} alt="Light Mode Icon" />
              <input
                type="checkbox"
                className="theme-toggle-checkbox"
                id="theme-toggle"
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
              <label className="theme-toggle-label" htmlFor="theme-toggle">
                <span className="theme-toggle-inner" />
                <span className="theme-toggle-switch" />
              </label>
              <img src={dark} className='dark' height={23} alt="Dark Mode Icon" />
            </div>
          </div>
        )}
        <div className="content-wrapper">
          <nav className="navbar">
            <div className='button_logo'>
              <button className="side-button" onClick={toggleSidebar}>
                {isSidebarVisible ? <img className='show' src={cancel} height={30} alt="Hide Sidebar Icon" /> : <img className='show' src={open} height={30} alt="Show Sidebar Icon" />}
              </button>
              <h1>Markdown</h1>
             
              <div className="doc_name">
              <div className='doc-logo'>
                <img src={doc} alt="Document Icon" className="doc-logo1" height={30} />
              </div>
              <div className='info'>
                <span>Document Name</span>
                <input
                  type="text"
                  className="current-doc"
                  value={currentDoc}
                  onChange={(e) => handleDocumentNameChange(e)}
                  onBlur={(e) => updateDocumentName(e)}
                />
              </div>
              </div>
            </div>
            <div className="nav-buttons">
              <button className='save-icon' onClick={saveDocument}><img src={disk} height={23} alt="Save Icon" /><span>Save Changes</span></button>
              {currentDoc && <button className='trash-icon' onClick={deleteDocument}><img src={trash} height={30} width={30} alt="Delete Icon" /></button>}
            </div>
          </nav>
          <div className={`editor-preview ${isFullPagePreview ? 'full-page' : ''}`}>
            <div className='pages'>
              {!isFullPagePreview && (
                <div className='editor-wrapper'>
                  <div className='page-label'>MARKDOWN
                    <label className='preview-button-markdown' onClick={toggleFullPagePreview}>
                      {isFullPagePreview ? <img className='show' src={hide} height={17} alt="Hide Icon" /> : <img className='show' src={show} height={17} alt="Show Icon" />}
                    </label>
                  </div>
                  <Editor markdown={markdown} onChange={handleMarkdownChange} />
                </div>
              )}
              <div className={`preview-wrapper ${isFullPagePreview ? 'full-page-preview' : ''}`}>
                <div className='page-label'>
                  PREVIEW
                  <label className='preview-button' onClick={toggleFullPagePreview}>
                    {isFullPagePreview ? <img className='show' src={hide} height={17} alt="Hide Icon" /> : <img className='show' src={show} height={17} alt="Show Icon" />}
                  </label>
                </div>
                <Preview markdown={markdown} />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      {isDeleteModalOpen && (
        <div className="cover">
          <div className="prompt">
            <h2>Delete this document?</h2>
            <p>Are you sure you want to delete the document "{docToDelete ? `${docToDelete}.md` : ''}" and its contents? This action cannot be reversed.</p>
            <div className="buttons">
              <button className=" confirm" onClick={confirmDeleteDocument}>Confirm and Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
