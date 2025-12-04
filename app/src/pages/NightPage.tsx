import styles from './NightPage.module.css'

export function NightPage() {
  return (
    <div className={styles.container}>
      <p className={styles.message}>
        目を閉じて、見たい夢を思い浮かべてください
      </p>
      <p className={styles.placeholder}>
        （プライミング機能は準備中）
      </p>
    </div>
  )
}
