public class Assignmentnew {

     static int sum(int n){
        int result =0;
        for(int i=1; i<=n; i++){
            result += i;
        }
        return result;
    }
    public static void main(String[] args) {
        int answer = sum(99);
        System.out.println(answer);
    }
}