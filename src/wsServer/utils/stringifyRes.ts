interface StringifyResProps {
  type: string
  data: any
  id: number
}

export const stringifyRes = (props: StringifyResProps) => {
  return JSON.stringify({
    ...props,
    data: props.data ? JSON.stringify(props.data) : "",
  })
}
