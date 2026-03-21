interface LoadInfoProps {
  loadName: string
  textColor: string
  loadCount: number
  loadPower: string
}

export function LoadInfo({ loadName, textColor, loadCount, loadPower }: LoadInfoProps) {
  const shortName = loadName[0]
  return (
    <div className="flex flex-col text-[10px]">
      <span className={textColor}>
        N{shortName}: {loadCount}
      </span>
      <span className={textColor}>
        P{shortName}: {loadPower} кВт
      </span>
    </div>
  )
}
