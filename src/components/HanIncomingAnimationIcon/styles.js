import {createStyles, makeStyles} from '@material-ui/core/styles';
import {keyframes} from "styled-components";

function returnKeyframes(color) {
  return keyframes`
  50% {
    background-color: ${color};
  }
`;
}

function animationLinear(colorFrom, colorTo) {
  return {
    borderRadius: '50%',
    background: colorFrom,
    animation: `${returnKeyframes(colorTo)} 1s infinite linear`
  };
}

const flexCenter = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const colorComing = '#0C8E36';

export const useStyles = makeStyles(theme =>
  createStyles({
    wrapIconLv2: {
      width: 90,
      height: 90,
      ...animationLinear(`${colorComing}1A`, `${colorComing}0D`),
      ...flexCenter
    },
    wrapIconLv1: {
      width: 64,
      height: 64,
      ...animationLinear(`${colorComing}42`, `${colorComing}1A`),
      ...flexCenter
    },
    wrapIcon: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: `${colorComing}`,
      ...flexCenter
    }
  })
);
