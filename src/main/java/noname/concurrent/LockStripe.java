package noname.concurrent;

import java.util.concurrent.locks.ReentrantLock;

public class LockStripe<T> {

    private final ReentrantLock[] locks;

    public static class AutoCloseableLock implements AutoCloseable {

        private final ReentrantLock lock;

        public AutoCloseableLock(ReentrantLock lock) {
            this.lock = lock;
            this.lock.lock();
        }

        @Override
        public void close() {
            this.lock.unlock();
        }
    }


    public LockStripe(int size) {
        locks = new ReentrantLock[size];
        for (int i = 0; i < size; i++) {
            locks[i] = new ReentrantLock();
        }
    }

    public AutoCloseableLock lockFor(T k) {
        return new AutoCloseableLock(locks[Math.abs(k.hashCode() % locks.length)]);
    }

}
