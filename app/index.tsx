import { Redirect } from "expo-router"

export default function Index() {
  return <Redirect href={"/Login/index" as any} />
}
