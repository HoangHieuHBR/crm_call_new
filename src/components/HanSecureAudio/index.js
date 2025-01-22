import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Requestor from '../../core/service/requestor';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import { styles } from './styles';
import { withStyles } from '@material-ui/core';

class SecureAudio extends Component {
  constructor(props) {
    super(props);
    this.fetchAudio = this.fetchAudio.bind(this);
    this.state = {
      error: null,
      loading: false
    };
    this.tokenRequest = `SecureAudio_${Date.now()}`;
    this.audioRef = React.createRef(null);
    this.reLoad = this.reLoad.bind(this);
    this.renderNoRecordFile = this.renderNoRecordFile.bind(this);
    this.renderHaveRecordFile = this.renderHaveRecordFile.bind(this);
    this.renderLoadingAndError = this.renderLoadingAndError.bind(this);
  }

  componentDidMount() {
    const { url } = this.props;
    this.fetchAudio(url);
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.fetchAudio(this.props.url);
    }
  }

  fetchAudio(url) {
    this.setState({
      loading: true,
      error: null
    });
    Requestor.get(url, null, null, this.tokenRequest, 'blob')
      .then(response => {
        var url = window.URL.createObjectURL(response);
        this.audioRef.current.src = url;
        this.setState({
          loading: false,
          error: null
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error: error
        });
      });
  }

  reLoad() {
    this.fetchAudio(this.props.url);
  }
  renderNoRecordFile() {
    const { t } = this.props;
    return <div>{t('No record')}</div>;
  }
  renderLoadingAndError() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress size={24} />
          </div>
        ) : this.state.error != null ? (
          <div className={classes.loadingContainer}>
            <IconButton aria-label="refresh" onClick={this.reLoad}>
              <ReplayIcon />
            </IconButton>
          </div>
        ) : null}
      </div>
    );
  }
  renderHaveRecordFile() {
    return (
      <div style={{ position: 'relative' }}>
        <audio controls ref={this.audioRef} />
        {this.renderLoadingAndError()}
      </div>
    );
  }

  render() {
    const { loading, error } = this.state;
    const { classes } = this.props;

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {this.props.url
          ? this.renderHaveRecordFile()
          : this.renderNoRecordFile()}
      </div>
    );
  }
}

SecureAudio.propTypes = {
  url: PropTypes.string,
  t: PropTypes.func
};

SecureAudio.defaultProps = {
  url: '',
  t: v => v
};

export default withStyles(styles)(SecureAudio);
