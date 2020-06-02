// @flow
import * as React from "react";
import Router from "next/router";
import NextLink from "next/link";
import { trim } from "lodash";

import { theme } from "../theme";
import axios, { post } from 'axios';

// Convert simple links to next style href + as
const Link = ({ to, children, basepath }) => (
  <NextLink
    href={{ pathname: "/view", query: { viewPath: to } }}
    as={basepath + "/" + to}
  >
    {children}
  </NextLink>
);

class BrowseHeader extends React.Component<*> {
  props: {
    path: string,
    basepath: string,
    type: string,
    commuterExecuteLink: ?string
  };

  static defaultProps = {
    active: "view"
  };

  handleItemClick = (e: SyntheticEvent<*>, { name }: { name: string }) => {
    Router.push(name);
  };

  onFormSubmit = (e) => {
    e.preventDefault() // Stop form submit
    console.log(this.state)
    this.fileUpload(this.state.file).then((response)=>{
      window.location.reload();
    })
  }

  onChange = (e) => {
    this.setState({file:e.target.files[0]})
  }

  fileUpload = file => {
    let formData = new FormData();
    console.log('File', file)
    formData.append('file', file)
    const url = window.location.origin + '/api/contents/' 
    return fetch(url, {
      method: 'POST',
      body: formData,
    });
  }

  render() {
    const { path, basepath } = this.props;
    let paths = trim(path, "/").split("/");
    // Empty path to start off
    if (paths.length === 1 && paths[0] === "") {
      paths = [];
    }

    // TODO: Ensure this works under an app subpath (which is not implemented yet)
    const filePath = basepath.replace(/view\/?/, "files/") + path;

    // const serverSide = typeof document === "undefined";
    const viewingNotebook = filePath.endsWith(".ipynb");

    return (
      <nav>
        <ul className="breadcrumbs">
          <li>
            <Link to={``} basepath={basepath}>
              <a>
                <span>home</span>
              </a>
            </Link>
          </li>
          {paths.map((name, index) => {
            const filePath = paths.slice(0, index + 1).join("/");
            return (
              <li key={`${filePath}`}>
                <Link to={`${filePath}`} basepath={basepath}>
                  <a>
                    <span>{name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        {this.props.type === "directory" ? (
              <div>
                <form onSubmit={this.onFormSubmit}>
                  <div className="button-wrapper">
                    <span className="label">Upload File</span>
                    <input type="file" name="upload" id="upload" className="upload-box" onChange={this.onChange} placeholder="Upload File" />
                  </div>
                  <button className="ops" type="submit">Upload</button>
                </form>
              </div>
        ) : (
          <React.Fragment>
            {this.props.commuterExecuteLink && viewingNotebook ? (
              <a
                href={`${this.props.commuterExecuteLink}/${path}`}
                className="ops"
              >
                Run
              </a>
            ) : null}
            <a href={filePath} download className="ops">
              Download
            </a>
          </React.Fragment>
        )}
        <style jsx>{`
          nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid ${theme.outline};
            padding: 0 1rem;
          }
          ul.breadcrumbs {
            display: flex;
            position: relative;

            margin: 0 0 0 0;
            padding: 0;

            list-style: none;
            background: #ffffff;
            font-family: "Source Sans Pro";
            font-size: 16px;
            color: ${theme.primary};
          }

          ul.breadcrumbs li {
            flex-direction: row;
            list-style-type: none;
            display: inline;
            text-align: center;
            display: flex;
            align-items: center;
          }

          ul.breadcrumbs li a {
            vertical-align: middle;
            display: table;
            padding: 1em;
            color: ${theme.primary};
            text-decoration: none;
          }

          ul.breadcrumbs li a:hover {
            text-decoration: underline;
          }

          ul.breadcrumbs li:last-child a {
            color: ${theme.active};
            text-decoration: none;
            cursor: pointer;
          }

          ul.breadcrumbs li + li:before {
            content: "›";
            color: ${theme.active};
          }

          .ops {
            display: inline-block;
            line-height: 2em;
            padding: 0 8px;
            border-radius: 2px;
            background-color: ${theme.background};
            border: 1px solid ${theme.outline};
            color: #000;
            text-decoration: none;
          }

          .ops:hover {
            background-color: ${theme.outline};
            transition: background-color 0.25s ease-out;
          }

          .ops:active {
            background-color: ${theme.primary};
            color: ${theme.active};
            transition: background-color 0.5s ease-out, color 6s ease-out;
          }

          .ops:not(:last-child) {
            margin-right: 10px;
          }

          .button-wrapper {
            position: relative;
            width: 150px;
            text-align: center;
            display: inline-block;
            margin-right: 24px;
          }
          
          .button-wrapper span.label {
            position: relative;
            z-index: 0;
            display: inline-block;
            width: 100%;
            background: #324767;
            cursor: pointer;
            color: #fff;
            padding: 10px 0;
            text-transform:uppercase;
            font-size:12px;
          }
          
          #upload {
              display: inline-block;
              position: absolute;
              z-index: 1;
              width: 100%;
              height: 50px;
              top: 0;
              left: 0;
              opacity: 0;
              cursor: pointer;
          }
        `}</style>
      </nav>
    );
  }
}

export default BrowseHeader;
