const sectionTitleCls = 'text-[10px] font-bold uppercase tracking-widest text-(--color-active)'

export function SectionTitle({ text }: { text: string }) {
  return <span className={sectionTitleCls}>{text}</span>
}
