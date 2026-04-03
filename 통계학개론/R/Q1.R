par(family="AppleGothic") 
# 문제1.

math_scores <- c(85, 92, 78, 90, 68, 88, 95, 72, 80, 75, 88, 92, 85, 90, 83,
                 79, 82, 87, 90, 93, 72, 85, 88, 78, 85, 90, 92, 80, 88, 85)

# 평균
mean(math_scores)

# 중앙값
median(math_scores)

# 최솟값
min(math_scores)

# 최댓값
max(math_scores)

# 히스토그램
hist(math_scores, main="수학 점수 히스토그램", xlab="점수")

# 상자그림
boxplot(math_scores, main="수학 점수 상자그림", ylab="점수")

