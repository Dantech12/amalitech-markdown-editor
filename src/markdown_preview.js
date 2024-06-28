import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

function Preview({ markdown }) {
  return (
    <section
      className="preview"
      dangerouslySetInnerHTML={{ __html: md.render(markdown) }}
    />
    
  );
}

Preview.propTypes = {
  markdown: PropTypes.string.isRequired,
};

export default Preview;
