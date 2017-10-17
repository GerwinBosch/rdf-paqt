import React from 'react';
import CodeMirror from 'react-codemirror';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import Play from 'material-ui/svg-icons/av/play-arrow';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui';
import { orangeA200 } from 'material-ui/styles/colors';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/sparql/sparql';
import 'codemirror/theme/material.css';
import SparqlVisualizer from './SparqlVisualizer';

import { getDefaultGraph } from './querybuilder';

class QueryWriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: 'SELECT ?s ?p ?o {?s ?p ?o} LIMIT 100',
      data: [],
      graphContexts: [],
      headers: [],
      error: '',
      processing: false,
    };
    props.executeQuery(getDefaultGraph(), (err, results) => {
      if (err) {
        this.setState({ error: err.message, data: [], headers: [] });
      } else {
        const currentstore = {};
        if (results.length !== 0) {
          results.forEach((result) => {
            if (!currentstore[result.subject.value]) {
              currentstore[result.subject.value] = {};
            }
            currentstore[result.subject.value][result.predicate.value] = result.object.value;
          });
        }
        const graphData = Object.keys(currentstore).map(
          item => ({ name: currentstore[item]['http://purl.org/dc/terms/title'], uri: item }));
        this.setState({ graphContexts: graphData });
      }
    });
  }
  onDataSourceChange = (event, index, value) => {
    this.setState({
      query: `SELECT ?subject ?predicate ?object WHERE { GRAPH <${value.uri}> {?subject ?predicate ?object}} LIMIT 100`,
      selectedGraph: value,
    });
    this.cm.codeMirror.setValue(`SELECT ?subject ?predicate ?object WHERE { GRAPH <${value.uri}> {?subject ?predicate ?object}} LIMIT 100`);
  };

  onQueryChange = (query) => {
    this.setState({ query });
  };

  onFireQuery = () => {
    this.setState({ processing: true });

    this.props.executeQuery(
      this.state.query, this.onQueryCallBack);
  };

  onQueryCallBack = (err, results) => {
    if (err) {
      this.setState({ error: err.message, data: [], headers: [], processing: false });
    } else if (results.length === 0) {
      this.setState({ error: '', data: [], headers: [], processing: false });
    } else {
      let data = results.map(result => Object.keys(result).map(value => result[value]));
      const headers = Object.keys(results[0]);
      data = data.sort(
        (a, b) =>
          a[0].value.localeCompare(b[0].value),
      );
      this.setState({ data, headers, error: '', processing: false });
    }
  };
  renderProgress = () => {
    if (this.state.processing) {
      return (
        <CircularProgress
          style={{
            margin: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          size={100}
          thickness={7}
          color={orangeA200}
        />
      );
    }
    return null;
  };


  render() {
    return (
      <div style={{ textAlign: 'start' }}>
        <SelectField
          floatingLabelText="Selected Database"
          value={this.state.selectedGraph}
          onChange={this.onDataSourceChange}
          style={{ paddingLeft: '12px' }}
        >
          {this.state.graphContexts.map(
            graph =>
              (<MenuItem
                key={graph.name}
                value={graph}
                primaryText={graph.name}
                label={graph.name}
              />))}
        </SelectField>
        <Divider />
        <CodeMirror
          // eslint-disable-next-line no-return-assign
          ref={el => this.cm = el}
          options={{
            mode: 'sparql',
            lineNumbers: true,
            theme: 'material',
          }}
          name="sparql query editor"
          value={this.state.query}
          onChange={this.onQueryChange}
        />
        <FloatingActionButton
          style={{ right: '40px', top: '100px', position: 'absolute' }}
          onClick={this.onFireQuery}
          disabled={this.state.processing}
        >
          <Play /></FloatingActionButton>
        <SparqlVisualizer
          data={this.state.data}
          headers={this.state.headers}
          error={this.state.error}
        />
        {this.renderProgress()}
      </div>
    );
  }
}

export default QueryWriter;

QueryWriter.propTypes = {
  executeQuery: PropTypes.func.isRequired,
};
