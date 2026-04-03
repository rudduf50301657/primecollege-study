# 문제4.

# 랜덤 시드 고정(2026)
set.seed(2026)

# 주어진 모비율(모집단 비율)
p <- 0.7

# 표본 크기별 반복 추출 및 표본비율 계산
sample_sizes <- c(10, 20, 50, 75, 100, 200)
n_reps <- 1000

for (n in sample_sizes) {
  sample_props <- numeric(n_reps)
  for (i in 1:n_reps) {
    sample_data <- sample(c(1, 0), size = n, replace = TRUE, prob = c(p, 1-p))
    sample_props[i] <- mean(sample_data)
  }
  cat("표본 크기:", n, "\n")
  cat("표본비율 평균:", mean(sample_props), "\n")
  cat("표본비율 표준편차:", sd(sample_props), "\n\n")
}

