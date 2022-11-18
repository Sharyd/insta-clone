import { useReducer } from "react";

enum actionInputs {
  INPUT = "INPUT",
  BLUR = "BLUR",
  RESET = "RESET",
}

const initialInputState = {
  value: "",
  isTouched: false,
};

interface inputAction {
  type: actionInputs;
  payload: string;
}

interface inputState {
  value: string;
  isTouched: boolean;
}

const inputStateReducer = (state: inputState, action: inputAction) => {
  const { type, payload } = action;
  if (type === actionInputs.INPUT) {
    return { value: payload, isTouched: state.isTouched };
  }

  if (type === actionInputs.BLUR) {
    return { isTouched: true, value: state.value };
  }

  if (type === actionInputs.RESET) {
    return { isTouched: false, value: "" };
  }

  return initialInputState;
};

const useInput = (validateValue: (arg: string) => boolean | null) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

  const valueIsValid = validateValue(inputState.value);
  const hasError = !valueIsValid && inputState.isTouched;

  const valueChangeHandler = (event: { target: { value: string } }) => {
    dispatch({ type: actionInputs.INPUT, payload: event.target.value });
  };
  const valueBlurHandler = () => {
    dispatch({
      type: actionInputs.BLUR,
      payload: "",
    });
  };

  const reset = () => {
    dispatch({
      type: actionInputs.RESET,
      payload: "",
    });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    hasError: hasError,
    valueChangeHandler,
    valueBlurHandler,
    reset,
  };
};

export default useInput;
