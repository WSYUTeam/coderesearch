#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>


void *thread(void *num)
{
	int a, i;
	pid_t pid;
	pthread_t tid;

	pid = getpid();
	tid = pthread_self();
	a = *(int *)num;
	
	for(i = 0; i < 10; i++)
		printf("%d  ",a++);
	printf("create success! thread pid %u tid %u (0x%x)\n",
	(unsigned int)pid ,(unsigned int)tid, (unsigned int)tid);
	
	return NULL;
}

int main(int argc, char *argv[])
{
	
	pthread_t id;
	int i, ret, a , b = 0;
	
	for(i = 1; i <= 10; i++)
	{
		a = (b+1)*10 - 9;		
		ret = pthread_create(&id, NULL,thread, &a);
		if(ret != 0)
		{
		fputs("create pthread error", stderr);
		}

		b++;
	
	}
	sleep(3);

	return 0;
}

