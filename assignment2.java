public class assignment2 {

    static int honer(int[]a, int n, int x){
        int result=a[n-1];
        for(int i=n-2; i>=0; i--){
            result = result*x + a[i];
        }
        return result;
    }
    public static void main(String[] args) {

        

        int answer = honer(new int[]{1,2,3,4,5}, 5, 2);
        System.out.println(answer);
    }
    
}
