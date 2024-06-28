import React from 'react';
import PropTypes from 'prop-types';

function Editor({ markdown, onChange }) {
  return (
    <div className="editor">
      
      <textarea rows={8}
      
        value={markdown}
        onChange={(e) => onChange(e.target.value)}
        
      />
    </div>
  );
}

Editor.propTypes = {
  markdown: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Editor;
