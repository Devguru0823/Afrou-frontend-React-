import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import SettingsIcon from '@material-ui/icons/Settings';
import People from '@material-ui/icons/People';
import Timelapse from '@material-ui/icons/Timelapse';
import StepConnector from '@material-ui/core/StepConnector';
import TrackChanges from '@material-ui/icons/TrackChanges'
import StarRate from '@material-ui/icons/StarRate'

const useQontoStepIconStyles = makeStyles({
  root: {
    background: '#e6f9ef',
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#ff7400',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(242,113,33) 50%, rgb(242,113,33) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(242,113,33) 50%, rgb(242,113,33) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    zIndex: 1,
    color: '#000',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(242,113,33) 50%, rgb(242,113,33) 100%)',
    color: '#fff',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(242,113,33) 50%, rgb(242,113,33) 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon className={`${classes.border} ${classes.icon}`} />,
    2: <TrackChanges className={`${classes.border} ${classes.icon}`} />,
    3: <People className={`${classes.border} ${classes.icon}`} />,
    4: <Timelapse className={`${classes.border} ${classes.icon}`} />,
    5: <StarRate className={`${classes.border} ${classes.icon}`} />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    {
      id: 0,
      title: 'Create'
    },
    {
      id: 1,
      title: 'Select Goal'
    },
    {
      id: 2,
      title: 'Select Target Audience'
    },
    {
      id: 3,
      title: 'Select Duration Span'
    },
    {
      id: 4,
      title: 'Review Your Advert'
    }    
  ];
}


export default function CustomizedSteppers(props) {
  const classes = useStyles();
  const steps = getSteps();

  return (
    <div className={classes.root}>
      <Stepper className="pr-0 pl-0" alternativeLabel activeStep={props.activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label.id} onClick={() => props.handleSetCurrent(label.id)}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}