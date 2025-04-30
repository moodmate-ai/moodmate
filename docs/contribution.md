# Contribution 하는 방법
  

## Branch 및 commit 전략
Github branch 전략을 사용한다.  
  
__새로운 기능을 추가 할 때__  
1. main에서 branch를 하나 만든다.
    - e.g. `feat/login`
2. 위에서 만든 branch에서 작업을 진행한다.
3. 작업이 완료된 경우 해당 branch를 최신 main으로 rebase한다.
4. Pull request를 올리고 리뷰를 받아 main에 반영한다.  
  

__Commit message__  
commit message는 아래 `message` 부분을 작성한다.  
"If this commit is merged, it will `message`".  
예시:  
- Add login func
- Fix issue #123
- Refactor dashboard design