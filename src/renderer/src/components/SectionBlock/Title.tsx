const sectionTitleCls = 'text-[10px] uppercase tracking-widest text-[#58a6ff]'

export function SectionTitle({ text }: { text: string }) {
  return <span className={sectionTitleCls}>{text}</span>
}
